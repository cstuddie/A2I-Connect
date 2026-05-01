const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID, 10);
    if (req.user?.id && req.user.id !== userID) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const limit  = parseInt(req.query.limit, 10)  || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const notifications = await notificationService.getNotificationsForUser(userID, limit, offset);
    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID, 10);
    if (req.user?.id && req.user.id !== userID) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await notificationService.getUnreadCount(userID);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const notificationID = parseInt(req.params.notificationID, 10);
    const userID = req.user?.id;
    const result = await notificationService.markRead(notificationID, userID);
    if (result === null)   return res.status(404).json({ error: 'Notification not found' });
    if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' });
    res.json({ message: 'Notification marked as read' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID, 10);
    if (req.user?.id && req.user.id !== userID) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await notificationService.markAllRead(userID);
    res.json({ message: 'All notifications marked as read', updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID, 10);
    if (req.user?.id && req.user.id !== userID) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const prefs = await notificationService.getPreferences(userID);
    res.json({
      NotifyMessageRequest:  prefs.NotifyMessageRequest,
      NotifyIncomingMessage: prefs.NotifyIncomingMessage,
      NotifyEventUpdate:     prefs.NotifyEventUpdate,
      NotifySessionReminder: prefs.NotifySessionReminder,
      ReminderLeadHours:     prefs.ReminderLeadHours,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID, 10);
    if (req.user?.id && req.user.id !== userID) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await notificationService.updatePreferences(userID, req.body);
    res.json({ message: 'Preferences updated' });
  } catch (e) {
    if (e.message?.startsWith('ReminderLeadHours')) {
      return res.status(400).json({ error: e.message });
    }
    console.error(e);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};
