const db = require('../../db/knex');

const VALID_LEAD_HOURS = [1, 3, 6, 12, 24, 48];

exports.getNotificationsForUser = (userID, limit = 20, offset = 0) =>
  db('Notification')
    .where('UserID', userID)
    .orderBy('CreatedAt', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');

exports.getUnreadCount = async (userID) => {
  const result = await db('Notification')
    .where({ UserID: userID, IsRead: false })
    .count('ID as count')
    .first();
  return { count: parseInt(result.count, 10) };
};

exports.markRead = async (notificationID, userID) => {
  const notification = await db('Notification')
    .where({ ID: notificationID })
    .first();
  if (!notification) return null;
  if (notification.UserID !== parseInt(userID, 10)) return 'forbidden';

  await db('Notification').where('ID', notificationID).update({ IsRead: true });
  return 'ok';
};

exports.markAllRead = async (userID) => {
  const updated = await db('Notification')
    .where({ UserID: userID, IsRead: false })
    .update({ IsRead: true });
  return updated;
};

exports.getPreferences = async (userID) => {
  let pref = await db('NotificationPreference').where('UserID', userID).first();
  if (!pref) {
    await db('NotificationPreference').insert({
      UserID: userID,
      NotifyMessageRequest: true,
      NotifyIncomingMessage: true,
      NotifyEventUpdate: true,
      NotifySessionReminder: true,
      ReminderLeadHours: 24,
      UpdatedAt: new Date(),
    });
    pref = await db('NotificationPreference').where('UserID', userID).first();
  }
  return pref;
};

exports.updatePreferences = async (userID, prefData) => {
  if (
    prefData.ReminderLeadHours !== undefined &&
    !VALID_LEAD_HOURS.includes(parseInt(prefData.ReminderLeadHours, 10))
  ) {
    throw new Error(`ReminderLeadHours must be one of: ${VALID_LEAD_HOURS.join(', ')}`);
  }

  const existing = await db('NotificationPreference').where('UserID', userID).first();
  if (!existing) {
    await db('NotificationPreference').insert({
      UserID: userID,
      NotifyMessageRequest: true,
      NotifyIncomingMessage: true,
      NotifyEventUpdate: true,
      NotifySessionReminder: true,
      ReminderLeadHours: 24,
      ...prefData,
      UpdatedAt: new Date(),
    });
  } else {
    await db('NotificationPreference')
      .where('UserID', userID)
      .update({ ...prefData, UpdatedAt: new Date() });
  }
};

exports.insertNotification = async ({
  userID,
  type,
  title,
  body,
  relatedEventID = null,
  relatedConversationID = null,
}) => {
  const [id] = await db('Notification').insert({
    UserID: userID,
    Type: type,
    Title: title,
    Body: body,
    RelatedEventID: relatedEventID,
    RelatedConversationID: relatedConversationID,
    IsRead: false,
    CreatedAt: new Date(),
  });
  return id;
};
