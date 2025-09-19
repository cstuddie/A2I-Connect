/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('courses_computer_science').del()
  await knex('courses_mathematics').del()
  await knex('courses_physics').del()
  await knex('courses_chemistry').del()
  await knex('courses_biology').del()
  await knex('courses_psychology').del()
  await knex('courses_architecture').del()
  await knex('courses_art').del()
  await knex('courses_aerospace_engineering').del()
  await knex('courses_biomedical_engineering').del()
  await knex('courses_data_science').del()
  await knex('courses_environmental_engineering').del()

  // Seeds the courses tables
  await knex('courses_computer_science').insert([
    {userID: 1,
      'Computer Architecture': false,
      'Computer Networks': false,
      'Operating Systems': false,
    },
    {userID: 3},
    {userID: 4},
    {userID: 7},
    {userID: 9},
    {userID: 12},
    {userID: 13},
    {userID: 19},
    {userID: 20},
  ]);
  await knex('courses_mathematics').insert([
    {userID: 1},
    {userID: 3},
    {userID: 4},
    {userID: 9},
    {userID: 19},
  ]);
  await knex('courses_physics').insert([
    {userID: 1},
    {userID: 9},
    {userID: 14},
  ]);
  await knex('courses_chemistry').insert([
    {userID: 8},
    {userID: 11},
    {userID: 17},
  ]);
  await knex('courses_biology').insert([
    {userID: 2},
    {userID: 5},
    {userID: 11},
    {userID: 15},
    {userID: 17},
  ]);
  await knex('courses_psychology').insert([
    {userID: 15},
  ]);
  await knex('courses_architecture').insert([
    {userID: 2},
    {userID: 16},
    {userID: 18},
  ]);
  await knex('courses_art').insert([
    {userID: 2},
    {userID: 3},
    {userID: 6},
    {userID: 10},
  ]);
  await knex('courses_aerospace_engineering').insert([
    {userID: 14},
  ]);
  await knex('courses_biomedical_engineering').insert([
    {userID: 17},
  ]);
  await knex('courses_data_science').insert([
    {userID: 1},
    {userID: 4},
    {userID: 7},
    {userID: 9},
    {userID: 12},
    {userID: 13},
    {userID: 19},
    {userID: 20},
  ]);
  await knex('courses_environmental_engineering').insert([
    {userID: 2},
    {userID: 5},
    {userID: 8},
    {userID: 11},
    {userID: 16},
    {userID: 18},
  ]);
  
};
