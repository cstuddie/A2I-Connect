const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

router.get('/:userID/unread-count',   requireAuth, ctrl.getUnreadCount);
router.get('/:userID/preferences',    requireAuth, ctrl.getPreferences);
router.put('/:userID/preferences',    requireAuth, ctrl.updatePreferences);
router.get('/:userID',                requireAuth, ctrl.getNotifications);
router.patch('/:notificationID/read', requireAuth, ctrl.markRead);
router.patch('/:userID/read-all',     requireAuth, ctrl.markAllRead);

module.exports = router;
