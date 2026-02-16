const express = require('express');
const router = express.Router();
const inboxController = require('../controllers/inboxController');

router.get('/conversation/:conversationID', inboxController.loadMessagesForConversation);
router.post('/:conversationID', inboxController.sendMessage);
router.get('/user/:userID', inboxController.loadConversations); 

module.exports = router;