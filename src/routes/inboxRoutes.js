const express = require('express');
const router = express.Router();
const inboxController = require('../controllers/inboxController');

router.post('/:conversationID', inboxController.sendMessage);
router.get('/:conversationID', inboxController.loadMessagesForConversation);
router.get('/:userID', inboxController.loadConversations);

module.exports = router;