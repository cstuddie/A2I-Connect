/**
 * Cross-team integration point for creating notifications.
 *
 * The messaging team (and any other team) should import ONLY this file:
 *   const { createNotification } = require('../utils/notificationUtils');
 *
 * Then wrap calls in try/catch so notification failures never break the caller:
 *   try { await createNotification({ ... }); } catch (e) { console.error(e); }
 */

const notificationService = require('../services/notificationService');

const TYPE_TO_PREF_KEY = {
  message_request:  'NotifyMessageRequest',
  incoming_message: 'NotifyIncomingMessage',
  event_update:     'NotifyEventUpdate',
  session_reminder: 'NotifySessionReminder',
};

/**
 * Create a notification for a user, respecting their preferences.
 *
 * @param {object} payload
 * @param {number} payload.userID               - Recipient user ID
 * @param {string} payload.type                 - 'message_request' | 'incoming_message' | 'event_update' | 'session_reminder'
 * @param {string} payload.title                - Display title (pre-rendered)
 * @param {string} payload.body                 - Display body (pre-rendered)
 * @param {number} [payload.relatedEventID]     - FK to Event (optional)
 * @param {number} [payload.relatedConversationID] - FK to Conversation (optional)
 * @returns {Promise<number|null>} Inserted notification ID, or null if preference disabled
 */
exports.createNotification = async ({
  userID,
  type,
  title,
  body,
  relatedEventID = null,
  relatedConversationID = null,
}) => {
  const prefKey = TYPE_TO_PREF_KEY[type];

  if (prefKey) {
    const prefs = await notificationService.getPreferences(userID);
    if (!prefs[prefKey]) return null;
  }

  return notificationService.insertNotification({
    userID,
    type,
    title,
    body,
    relatedEventID,
    relatedConversationID,
  });
};
