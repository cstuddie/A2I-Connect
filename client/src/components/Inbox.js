import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseUTCDateTime } from '../utils/dateUtils';
import JitsiMeeting from './JitsiMeeting';
import { UserHeader } from './Dashboard';
import './LandingPage.css';
import './Inbox.css';

const Inbox = () => {
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedPreview, setAttachedPreview] = useState(null);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [callActive, setCallActive] = useState(false);
    const messagesEndRef = useRef(null);
    const pollIntervalRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const userID = localStorage.getItem('userID');

    const activeConvoData = conversations.find(c => c.ConversationID === activeConversation);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/inbox/user/${userID}`);
                if (!response.ok) throw new Error('Failed to fetch conversations');
                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [userID]);

    useEffect(() => { setCallActive(false); }, [activeConversation]);

    useEffect(() => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (!activeConversation) { setMessages([]); return; }

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:3001/inbox/conversation/${activeConversation}`);
                if (res.ok) setMessages(await res.json());
            } catch (err) { console.error('Error fetching messages:', err); }
        };

        setMessagesLoading(true);
        fetchMessages().finally(() => setMessagesLoading(false));
        pollIntervalRef.current = setInterval(fetchMessages, 4000);
        return () => clearInterval(pollIntervalRef.current);
    }, [activeConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAttachedFile(file);
        setAttachedPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
        e.target.value = '';
    };

    const handleRemoveFile = () => {
        if (attachedPreview) URL.revokeObjectURL(attachedPreview);
        setAttachedFile(null);
        setAttachedPreview(null);
    };

    const handleStartCall = async () => {
        const roomName = `a2iconnect-conv-${activeConversation}`;
        const joinURL = `https://meet.jit.si/${roomName}`;
        try {
            const formData = new FormData();
            formData.append('Content', `📹 Video call started — Join: ${joinURL}`);
            formData.append('SenderID', userID);
            await fetch(`http://localhost:3001/inbox/${activeConversation}`, { method: 'POST', body: formData });
            const res = await fetch(`http://localhost:3001/inbox/conversation/${activeConversation}`);
            if (res.ok) setMessages(await res.json());
        } catch (err) { console.error('Error posting call message:', err); }
        setCallActive(true);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if ((!trimmed && !attachedFile) || sendingMsg) return;
        setSendingMsg(true);
        try {
            const formData = new FormData();
            formData.append('Content', trimmed);
            formData.append('SenderID', userID);
            if (attachedFile) formData.append('file', attachedFile);
            await fetch(`http://localhost:3001/inbox/${activeConversation}`, { method: 'POST', body: formData });
            setNewMessage('');
            handleRemoveFile();
            const res = await fetch(`http://localhost:3001/inbox/conversation/${activeConversation}`);
            if (res.ok) setMessages(await res.json());
        } catch (err) { console.error('Error sending message:', err); }
        finally { setSendingMsg(false); }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = parseUTCDateTime(timestamp);
        if (!date) return '';
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffInDays = Math.round((todayStart - dateStart) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) return (
        <div className="dash-root">
            <UserHeader />
            <div className="inbox-status">Loading conversations...</div>
        </div>
    );

    if (error) return (
        <div className="dash-root">
            <UserHeader />
            <div className="inbox-status error">Error: {error}</div>
        </div>
    );

    return (
        <div className="dash-root">
            <UserHeader />

            <div className="inbox-layout">

                {/* Sidebar */}
                <div className="inbox-sidebar">
                    <div className="inbox-sidebar-header">
                        <button className="inbox-back-btn" onClick={() => navigate(-1)}>← Back</button>
                        <h2 className="inbox-sidebar-title">Messages</h2>
                    </div>

                    <div className="inbox-convo-list">
                        {conversations.length === 0 ? (
                            <p className="inbox-empty-list">No conversations yet</p>
                        ) : (
                            conversations.map(convo => (
                                <div
                                    key={convo.ConversationID}
                                    className={`inbox-convo-item ${activeConversation === convo.ConversationID ? 'active' : ''}`}
                                    onClick={() => setActiveConversation(convo.ConversationID)}
                                >
                                    <div className="inbox-convo-avatar">
                                        {convo.FirstName?.[0]}{convo.LastName?.[0]}
                                    </div>
                                    <div className="inbox-convo-info">
                                        <div className="inbox-convo-top">
                                            <span className="inbox-convo-name">{convo.FirstName} {convo.LastName}</span>
                                            <span className="inbox-convo-time">{formatTimestamp(convo.TimeStamp)}</span>
                                        </div>
                                        <div className="inbox-convo-bottom">
                                            <span className="inbox-convo-preview">{convo.Content}</span>
                                            {!convo.Read && <span className="inbox-unread-dot" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="inbox-chat">
                    {activeConversation ? (
                        <div className="inbox-chat-inner">

                            {/* Chat Header */}
                            <div className="inbox-chat-header">
                                <div className="inbox-chat-header-avatar">
                                    {activeConvoData?.FirstName?.[0]}{activeConvoData?.LastName?.[0]}
                                </div>
                                <span className="inbox-chat-header-name">
                                    {activeConvoData ? `${activeConvoData.FirstName} ${activeConvoData.LastName}` : ''}
                                </span>
                                {!callActive && (
                                    <button className="inbox-call-btn" onClick={handleStartCall}>
                                        📹 Video Call
                                    </button>
                                )}
                            </div>

                            {/* Messages */}
                            <div className="inbox-messages">
                                {messagesLoading ? (
                                    <div className="inbox-status">Loading messages...</div>
                                ) : messages.length === 0 ? (
                                    <div className="inbox-status muted">No messages yet. Say hello!</div>
                                ) : (
                                    messages.map(msg => {
                                        const isMine = parseInt(msg.SenderID) === parseInt(userID);
                                        return (
                                            <div key={msg.ID} className={`inbox-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                                {msg.Content && <div className="inbox-bubble-text">{msg.Content}</div>}
                                                {msg.FileName && (
                                                    msg.FileType?.startsWith('image/') ? (
                                                        <img
                                                            className="inbox-bubble-image"
                                                            src={`http://localhost:3001/inbox/message/${msg.ID}/file`}
                                                            alt={msg.FileName}
                                                            onClick={() => setLightboxSrc(`http://localhost:3001/inbox/message/${msg.ID}/file`)}
                                                        />
                                                    ) : (
                                                        <a
                                                            className="inbox-bubble-file"
                                                            href={`http://localhost:3001/inbox/message/${msg.ID}/file`}
                                                            download={msg.FileName}
                                                        >
                                                            📄 {msg.FileName}
                                                        </a>
                                                    )
                                                )}
                                                <div className="inbox-bubble-time">{formatTimestamp(msg.TimeStamp)}</div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="inbox-input-wrapper">
                                {attachedFile && (
                                    <div className="inbox-file-preview">
                                        {attachedPreview
                                            ? <img className="inbox-file-thumb" src={attachedPreview} alt={attachedFile.name} />
                                            : <span className="inbox-file-name">📄 {attachedFile.name}</span>
                                        }
                                        <button type="button" className="inbox-file-remove" onClick={handleRemoveFile}>×</button>
                                    </div>
                                )}
                                <form className="inbox-input-row" onSubmit={handleSendMessage}>
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".jpg,.jpeg,.png,.gif,.pdf,.docx" />
                                    <button type="button" className="inbox-attach-btn" onClick={() => fileInputRef.current?.click()}>📎</button>
                                    <input
                                        className="inbox-text-input"
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        disabled={sendingMsg}
                                    />
                                    <button className="inbox-send-btn" type="submit" disabled={sendingMsg || (!newMessage.trim() && !attachedFile)}>
                                        {sendingMsg ? '...' : 'Send'}
                                    </button>
                                </form>
                            </div>

                            {callActive && (
                                <JitsiMeeting
                                    roomName={`a2iconnect-conv-${activeConversation}`}
                                    displayName={localStorage.getItem('userName') || 'User'}
                                    onClose={() => setCallActive(false)}
                                />
                            )}

                            {lightboxSrc && (
                                <div className="inbox-lightbox" onClick={() => setLightboxSrc(null)}>
                                    <img className="inbox-lightbox-img" src={lightboxSrc} alt="Full size" onClick={e => e.stopPropagation()} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="inbox-no-chat">
                            <div className="inbox-no-chat-icon">💬</div>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;