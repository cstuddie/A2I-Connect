/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('Event', (table) => {
    table
      .integer('InstructorID')
      .unsigned()
      .references('ID')
      .inTable('User')
      .onDelete('CASCADE')
      .nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('Event', (table) => {
    table.dropColumn('InstructorID');
  });
};
