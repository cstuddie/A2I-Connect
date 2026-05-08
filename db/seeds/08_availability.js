/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Availability').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Availability').insert([
    // Alice (1) — Web Development
    { UserID: 1, DayOfWeek: 'Monday',    StartTime: '09:00:00', EndTime: '12:00:00' },
    { UserID: 1, DayOfWeek: 'Wednesday', StartTime: '14:00:00', EndTime: '17:00:00' },
    { UserID: 1, DayOfWeek: 'Friday',    StartTime: '10:00:00', EndTime: '14:00:00' },

    // Bob (2) — Data Science
    { UserID: 2, DayOfWeek: 'Tuesday',   StartTime: '10:00:00', EndTime: '16:00:00' },
    { UserID: 2, DayOfWeek: 'Thursday',  StartTime: '09:00:00', EndTime: '12:00:00' },

    // Carol (3) — AI & ML
    { UserID: 3, DayOfWeek: 'Monday',    StartTime: '13:00:00', EndTime: '17:00:00' },
    { UserID: 3, DayOfWeek: 'Wednesday', StartTime: '10:00:00', EndTime: '14:00:00' },

    // David (5) — Cybersecurity
    { UserID: 5, DayOfWeek: 'Tuesday',   StartTime: '09:00:00', EndTime: '12:00:00' },
    { UserID: 5, DayOfWeek: 'Thursday',  StartTime: '14:00:00', EndTime: '18:00:00' },

    // Sophia (9) — AI & ML
    { UserID: 9, DayOfWeek: 'Monday',    StartTime: '10:00:00', EndTime: '16:00:00' },
    { UserID: 9, DayOfWeek: 'Friday',    StartTime: '09:00:00', EndTime: '13:00:00' }
  ]);
};
