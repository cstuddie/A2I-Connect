/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('courses_computer_science', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Data Structures').defaultTo(true );
    table.boolean('Algorithms').defaultTo(true);
    table.boolean('Computer Architecture').defaultTo(true);
    table.boolean('Operating Systems').defaultTo(true);
    table.boolean('Computer Networks').defaultTo(true);
    table.boolean('Database Systems').defaultTo(true);
    table.boolean('Artificial Intelligence').defaultTo(true);
  })
  .createTable('courses_mathematics', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Linear Algebra').defaultTo(true);
    table.boolean('Calculus').defaultTo(true);
    table.boolean('Probability').defaultTo(true);
    table.boolean('Statistics').defaultTo(true);
  })
  .createTable('courses_physics', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Quantum Mechanics').defaultTo(true);
    table.boolean('Relativity').defaultTo(true);
    table.boolean('Particle Physics').defaultTo(true);
  })
  .createTable('courses_chemistry', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Organic Chemistry').defaultTo(true);
    table.boolean('Inorganic Chemistry').defaultTo(true);
    
  })
  .createTable('courses_biology', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Genetics').defaultTo(true);
    table.boolean('Cell Biology').defaultTo(true);
    table.boolean('Molecular Biology').defaultTo(true);
  })
  .createTable('courses_psychology', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Psychology').defaultTo(true);
    table.boolean('Neuroscience').defaultTo(true);
  })
  .createTable('courses_architecture', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Architecture').defaultTo(true);
    table.boolean('Urban Planning').defaultTo(true);
  })
  .createTable('courses_art', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Modern Art').defaultTo(true);
    table.boolean('Art History').defaultTo(true);
  })
  .createTable('courses_aerospace_engineering', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Flight Mechanics').defaultTo(true);
    table.boolean('Aeronautical Engineering').defaultTo(true);
    table.boolean('Spacecraft Design').defaultTo(true);
    table.boolean('Astrodynamics').defaultTo(true);
  })
  .createTable('courses_biomedical_engineering', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Biomechanics').defaultTo(true);
    table.boolean('Medical Imaging').defaultTo(true);
  })
  .createTable('courses_data_science', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Big Data Analytics').defaultTo(true);
    table.boolean('Machine Learning').defaultTo(true);
    table.boolean('Deep Learning').defaultTo(true);
    table.boolean('Natural Language Processing').defaultTo(true);
    table.boolean('Computer Vision').defaultTo(true);
    table.boolean('Reinforcement Learning').defaultTo(true);
    table.boolean('Data Visualization').defaultTo(true);
  })
  .createTable('courses_environmental_engineering', function(table) {
    table.integer('userID').unsigned().notNullable().unique();
    table.foreign('userID').references('userID').inTable('users');
    table.boolean('Environmental Chemistry').defaultTo(true);
    table.boolean('Environmental Regulations').defaultTo(true);
  });   
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('courses_computer_science').dropTable('courses_mathematics').dropTable('courses_physics').dropTable('courses_chemistry').dropTable('courses_biology').dropTable('courses_psychology').dropTable('courses_architecture').dropTable('courses_art').dropTable('courses_aerospace_engineering').dropTable('courses_biomedical_engineering').dropTable('courses_data_science').dropTable('courses_environmental_engineering');
};
