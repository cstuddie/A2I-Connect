const express = require('express');
const router = express.Router();
const multer = require('multer');
const inboxController = require('../controllers/inboxController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/create', inboxController.createConversation);
router.get('/conversation-by-event/:eventID', inboxController.getConversationByEvent);
router.get('/conversation/:conversationID', inboxController.loadMessagesForConversation);
router.get('/message/:messageID/file', inboxController.getMessageFile);
router.post('/:conversationID', upload.single('file'), inboxController.sendMessage);
router.get('/user/:userID', inboxController.loadConversations);

module.exports = router;
