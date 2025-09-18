/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('events', function(table) {
        table.increments('eventID');
        table.integer('instructorID').unsigned().references('userID').inTable('users');
        table.string('topic').notNullable();
        table.string('description').notNullable();
        table.date('date').notNullable();
        table.string('field').notNullable();
        table.string('course').notNullable();
        table.string('affiliation').notNullable().defaultTo('Independent Professional');
        table.string('deliveryMethod').notNullable();
        table.string('status').notNullable();
        table.integer('requesterID').notNullable().unsigned().references('userID').inTable('users');
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('events');
};
