/**
 * reminderJob.js — Hourly session reminder scheduler.
 *
 * Runs immediately on require() and then every hour.
 * Exports runReminderCheck() so it can be called directly in tests.
 *
 * To test manually in a Node REPL or test file:
 *   const { runReminderCheck } = require('./src/jobs/reminderJob');
 *   await runReminderCheck();
 */

const db = require('../../db/knex');
const { createNotification } = require('../utils/notificationUtils');

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const DEDUP_WINDOW_MS   = 2 * 60 * 60 * 1000; // 2 hours — prevents duplicate reminders on restart

const runReminderCheck = async () => {
  try {
    // Find all distinct ReminderLeadHours values in use by users who want session reminders
    const leadValues = await db('NotificationPreference')
      .where('NotifySessionReminder', true)
      .distinct('ReminderLeadHours')
      .pluck('ReminderLeadHours');

    if (leadValues.length === 0) return;

    const now = Date.now();

    for (const leadHours of leadValues) {
      // Window: events whose Date falls within [now + leadHours - 1h, now + leadHours]
      const windowStart = new Date(now + leadHours * 3_600_000 - CHECK_INTERVAL_MS);
      const windowEnd   = new Date(now + leadHours * 3_600_000);

      const events = await db('Event')
        .where('EventStatus', 2) // 2 = Scheduled
        .whereBetween('Date', [windowStart, windowEnd])
        .select('ID', 'RequesterID', 'InstructorID', 'Topic', 'Date');

      for (const event of events) {
        const recipients = [event.RequesterID, event.InstructorID].filter(Boolean);

        for (const uid of recipients) {
          // Only notify users who have this specific lead time configured
          const pref = await db('NotificationPreference')
            .where({ UserID: uid, NotifySessionReminder: true, ReminderLeadHours: leadHours })
            .first();
          if (!pref) continue;

          // Dedup: skip if a reminder for this user+event was already sent recently
          const dedupCutoff = new Date(now - DEDUP_WINDOW_MS);
          const alreadySent = await db('Notification')
            .where({ UserID: uid, Type: 'session_reminder', RelatedEventID: event.ID })
            .where('CreatedAt', '>', dedupCutoff)
            .first();
          if (alreadySent) continue;

          const formattedDate = new Date(event.Date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          await createNotification({
            userID:         uid,
            type:           'session_reminder',
            title:          `Upcoming session: ${event.Topic}`,
            body:           `Your session "${event.Topic}" is scheduled for ${formattedDate}.`,
            relatedEventID: event.ID,
          });
        }
      }
    }
  } catch (e) {
    console.error('[reminderJob] Error during reminder check:', e);
  }
};

// Auto-start when required by server.js
runReminderCheck();
setInterval(runReminderCheck, CHECK_INTERVAL_MS);

module.exports = { runReminderCheck };
