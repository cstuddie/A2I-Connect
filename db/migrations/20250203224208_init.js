/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('userID');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);
  })
  .createTable('profile', function(table) {
    table.increments('profileID');
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.string('name').notNullable();
    table.string('interests');
    table.string('history');
    table.string('expertise');
    table.string('affiliation');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('profile').dropTable('users');
};
