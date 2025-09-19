/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('admin', function(table) {
    table.increments('adminID');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);
  })
  .createTable('interests', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Computer Science').defaultTo(false);
    table.boolean('Mathematics').defaultTo(false);
    table.boolean('Physics').defaultTo(false);
    table.boolean('Chemistry').defaultTo(false);
    table.boolean('Biology').defaultTo(false);
    table.boolean('Psychology').defaultTo(false);
    table.boolean('Architecture').defaultTo(false);
    table.boolean('Art').defaultTo(false);
    table.boolean('Aerospace Engineering').defaultTo(false);
    table.boolean('Biomedical Engineering').defaultTo(false);
    table.boolean('Data Science').defaultTo(false);
    table.boolean('Environmental Engineering').defaultTo(false);
  });
}; 

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('admin').dropTable('interests');
};
