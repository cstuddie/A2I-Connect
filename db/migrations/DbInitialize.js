/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('Expertise', (table) => {
    table.increments('ID');
    table.integer('Field').notNullable();
    table.string('Title').notNullable();
  });

  await knex.schema.createTable('User', (table) => {
    table.increments('ID');
    table.string('Email').notNullable().unique();
    table.string('Password').notNullable();
    table.integer('Role').notNullable();
    table.string('FirstName').notNullable();
    table.string('LastName').notNullable();
    table
      .integer('ExpertiseID')
      .unsigned()
      .references('ID')
      .inTable('Expertise')
      .onDelete('SET NULL');
    table.text('Bio');
    table.float('Rating');
    table.integer('Status');
    table.string('Affiliation');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('Event', (table) => {
    table.increments('ID');
    table
      .integer('RequesterID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table.string('Topic').notNullable();
    table.text('Description');
    table.date('Date');
    table.integer('EventStatus');
    table
      .integer('ExpertiseID')
      .unsigned()
      .references('ID')
      .inTable('Expertise')
      .onDelete('SET NULL');
    table.string('DeliveryMethod');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('Conversation', (table) => {
    table.increments('ID');
    table
      .integer('InitiatorID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .integer('RecieverID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .integer('AssociatedEventID')
      .unsigned()
      .references('ID')
      .inTable('Event')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('Message', (table) => {
    table.increments('ID');
    table.datetime('TimeStamp').notNullable().defaultTo(knex.fn.now());
    table.text('Content').notNullable();
    table
      .integer('SenderID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .integer('ConversationID')
      .unsigned()
      .references('ID')
      .inTable('Conversation')
      .onDelete('CASCADE');
    table.boolean('Read').defaultTo(false);
  });

  await knex.schema.createTable('Reviews', (table) => {
    table.increments('ID');
    table.datetime('Date').notNullable().defaultTo(knex.fn.now());
    table.text('Content');
    table
      .integer('ReviewerID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .integer('AssociatedEventID')
      .unsigned()
      .references('ID')
      .inTable('Event')
      .onDelete('CASCADE');
    table
      .integer('RecieverID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
  });
};

