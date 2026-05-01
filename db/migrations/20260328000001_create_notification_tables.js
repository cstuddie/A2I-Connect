exports.up = function (knex) {
  return knex.schema
    .createTable('Notification', (table) => {
      table.increments('ID').primary();
      table.integer('UserID').unsigned().notNullable();
      table.foreign('UserID').references('User.ID').onDelete('CASCADE');
      table.string('Type', 50).notNullable();
      table.string('Title', 255).notNullable();
      table.text('Body').notNullable();
      table.integer('RelatedEventID').unsigned().nullable();
      table.foreign('RelatedEventID').references('Event.ID').onDelete('SET NULL');
      table.integer('RelatedConversationID').unsigned().nullable();
      table.boolean('IsRead').defaultTo(false);
      table.datetime('CreatedAt').defaultTo(knex.fn.now());
    })
    .createTable('NotificationPreference', (table) => {
      table.increments('ID').primary();
      table.integer('UserID').unsigned().notNullable().unique();
      table.foreign('UserID').references('User.ID').onDelete('CASCADE');
      table.boolean('NotifyMessageRequest').defaultTo(true);
      table.boolean('NotifyIncomingMessage').defaultTo(true);
      table.boolean('NotifyEventUpdate').defaultTo(true);
      table.boolean('NotifySessionReminder').defaultTo(true);
      table.integer('ReminderLeadHours').defaultTo(24);
      table.datetime('UpdatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('NotificationPreference')
    .dropTableIfExists('Notification');
};
