const inboxService = require('../services/inboxService');

exports.loadConversations = async (req, res) => {
    try {
        const userID = req.params.userID;
        const conversations = await inboxService.getAllConversations(userID);
        res.json(conversations || []);
    } catch (e) {
        console.error('Error fetching conversations:', e);
        res.status(500).json({ error: 'An error occurred on conversations', details: e.message });
    }
};

exports.loadMessagesForConversation = async (req, res) => {
    try {
        const conversationID = req.params.conversationID;
        const messages = await inboxService.getMessagesForConversation(conversationID);
        res.json(messages || []);
    } catch (e) {
        console.error('Error fetching messages:', e);
        res.status(500).json({ error: 'An error occurred on messages', details: e.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const conversationID = req.params.conversationID;
        const { Content, SenderID } = req.body;

        const result = await inboxService.sendMessage({
            Content,
            SenderID,
            ConversationID: conversationID
        });

        res.status(201).json(result);
    } catch (e) {
        console.error('Error sending message:', e);
        res.status(500).json({
            error: 'An error occurred sending message',
            details: e.message
        });
    }
};