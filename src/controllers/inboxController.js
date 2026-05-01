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

        let FileName = null, FileType = null, FileData = null;
        if (req.file) {
            FileName = req.file.originalname;
            FileType = req.file.mimetype;
            FileData = req.file.buffer;
        }

        const result = await inboxService.sendMessage({
            Content, SenderID, ConversationID: conversationID, FileName, FileType, FileData
        });

        res.status(201).json(result);
    } catch (e) {
        console.error('Error sending message:', e);
        res.status(500).json({ error: 'An error occurred sending message', details: e.message });
    }
};

exports.getMessageFile = async (req, res) => {
    try {
        const file = await inboxService.getMessageFile(req.params.messageID);
        if (!file || !file.FileData) return res.status(404).json({ error: 'File not found' });
        res.setHeader('Content-Type', file.FileType);
        res.setHeader('Content-Disposition',
            file.FileType.startsWith('image/')
                ? `inline; filename="${file.FileName}"`
                : `attachment; filename="${file.FileName}"`
        );
        res.send(file.FileData);
    } catch (e) {
        console.error('Error fetching file:', e);
        res.status(500).json({ error: 'Failed to fetch file' });
    }
};

exports.getConversationByEvent = async (req, res) => {
    try {
        const conversation = await inboxService.getConversationByEventID(req.params.eventID);
        if (!conversation) return res.status(404).json({ error: 'No conversation found for this event' });
        res.json({ conversationID: conversation.ID });
    } catch (e) {
        console.error('Error fetching conversation by event:', e);
        res.status(500).json({ error: 'An error occurred', details: e.message });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const { initiatorID, receiverID } = req.body;
        
        console.log('Creating conversation between:', initiatorID, 'and', receiverID);
        
        const conversation = await inboxService.createConversation({
            initiatorID,
            receiverID
        });
        
        console.log('Conversation created:', conversation);
        
        res.status(201).json(conversation);
    } catch (e) {
        console.error('Error creating conversation:', e);
        res.status(500).json({
            error: 'An error occurred creating conversation',
            details: e.message
        });
    }
};