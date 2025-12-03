/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop the old Interests table if it exists
  await knex.schema.dropTableIfExists('Interests');

  // Create new Interests table
  await knex.schema.createTable('Interests', (table) => {
    table.increments('ID').primary();
    table.string('Title').notNullable().unique();
  });

  await knex.schema.createTable('User_Interests', (table) => {
    table.increments('ID').primary();
    table
      .integer('UserID')
      .unsigned()
      .notNullable()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE');
    table
      .integer('InterestID')
      .unsigned()
      .notNullable()
      .references('ID')
      .inTable('Interests')
      .onDelete('CASCADE');
    table.unique(['UserID', 'InterestID']); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('User_Interests');
  await knex.schema.dropTableIfExists('Interests');
};
