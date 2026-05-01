import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Base.css';

const Inbox = () => {
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userID = localStorage.getItem('userID');

    // Fetch conversations from backend
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/inbox/user/${userID}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }

                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userID]);

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    if (loading) {
        return <div className="inbox-loading">Loading conversations...</div>;
    }

    if (error) {
        return <div className="inbox-error">Error: {error}</div>;
    }

    return (
        <div className="inbox-container">
            {/* Left side - Conversation list */}
            <div className="conversation-list">
                <div className="list-header">
                    <button 
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <h2>All Chats</h2>
                </div>

                <div className="conversations">
                    {conversations.length === 0 ? (
                        <div className="no-conversations">No conversations yet</div>
                    ) : (
                        conversations.map(convo => (
                            <div
                                key={convo.ConversationID}
                                className={`convo-card ${activeConversation === convo.ConversationID ? 'active' : ''}`}
                                onClick={() => setActiveConversation(convo.ConversationID)}
                            >
                                <div className="convo-card-content">
                                    <div className="convo-card-header">
                                        <h3 className="convo-card-name">
                                            {convo.FirstName} {convo.LastName}
                                        </h3>
                                        <span className="convo-card-timestamp">
                                            {formatTimestamp(convo.TimeStamp)}
                                        </span>
                                    </div>
                                    
                                    <div className="convo-card-footer">
                                        <p className="convo-card-message">{convo.Content}</p>
                                        {!convo.Read && (
                                            <span className="unread-badge">•</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right side - Chat view */}
            <div className="chat-view">
                {activeConversation ? (
                    <div>Chat with conversation {activeConversation}</div>
                ) : (
                    <div className="no-chat-selected">
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;