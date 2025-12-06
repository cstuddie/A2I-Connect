/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0;');

  const tables = await knex.raw('SHOW TABLES');
  const tableKey = `Tables_in_${process.env.DB_NAME}`;

  for (const row of tables[0]) {
    const tableName = row[tableKey];

    if (tableName === 'knex_migrations' || tableName === 'knex_migrations_lock') {
      continue;
    }

    await knex.schema.dropTableIfExists(tableName);
  }

  await knex.raw('SET FOREIGN_KEY_CHECKS = 1;');


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

    table
      .integer('InstructorID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE')
      .nullable();

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

  // 3) UserInterests table (no foreign keys, just integer IDs)
  await knex.schema.createTable('UserInterests', (table) => {
    table.increments('ID').primary();
    table.integer('UserID').unsigned().notNullable();
    table.integer('InterestID').unsigned().notNullable();
    table.unique(['UserID', 'InterestID']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('UserInterests');
  await knex.schema.dropTableIfExists('Reviews');
  await knex.schema.dropTableIfExists('Message');
  await knex.schema.dropTableIfExists('Conversation');
  await knex.schema.dropTableIfExists('Event');
  await knex.schema.dropTableIfExists('User');
  await knex.schema.dropTableIfExists('Expertise');
};
