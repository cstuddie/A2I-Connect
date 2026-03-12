/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('Availability', (table) => {
    table.increments('ID');
    table
      .integer('UserID')
      .unsigned()
      .notNullable()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .enu('DayOfWeek', [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ])
      .notNullable();
    table.time('StartTime').notNullable();
    table.time('EndTime').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('Availability');
};
