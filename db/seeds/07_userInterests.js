/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('UserInterests').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('UserInterests').insert([
    // Alice: Web Dev + Data Science
    { UserID: 1, InterestID: 1 },
    { UserID: 1, InterestID: 2 },

    // Bob: Data Science
    { UserID: 2, InterestID: 2 },

    // Carol: AI & ML
    { UserID: 3, InterestID: 3 }
  ]);
};
