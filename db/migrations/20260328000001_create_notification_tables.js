/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('Notification', (table) => {
    table.increments('ID');

    table
      .integer('UserID')
      .unsigned()
      .notNullable()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');

    table.string('Type', 50).notNullable();
    table.string('Title', 255).notNullable();
    table.text('Body').notNullable();

    table
      .integer('RelatedEventID')
      .unsigned()
      .nullable()
      .references('ID')
      .inTable('Event')
      .onDelete('SET NULL');

    table
      .integer('RelatedConversationID')
      .unsigned()
      .nullable()
      .references('ID')
      .inTable('Conversation')
      .onDelete('SET NULL');

    table.boolean('IsRead').notNullable().defaultTo(false);
    table.datetime('CreatedAt').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('NotificationPreference', (table) => {
    table.increments('ID');

    table
      .integer('UserID')
      .unsigned()
      .notNullable()
      .unique()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');

    table.boolean('NotifyMessageRequest').notNullable().defaultTo(true);
    table.boolean('NotifyIncomingMessage').notNullable().defaultTo(true);
    table.boolean('NotifyEventUpdate').notNullable().defaultTo(true);
    table.boolean('NotifySessionReminder').notNullable().defaultTo(true);
    table.integer('ReminderLeadHours').notNullable().defaultTo(24);
    table.datetime('UpdatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('NotificationPreference');
  await knex.schema.dropTableIfExists('Notification');
};
