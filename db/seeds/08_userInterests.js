/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex('UserInterests').del();

  await knex('UserInterests').insert([
    // Alice (UserID 1)
    { UserID: 1, InterestID: 1 },   
    { UserID: 1, InterestID: 11 },  

    // Bob (UserID 2)
    { UserID: 2, InterestID: 2 },   
    { UserID: 2, InterestID: 12 },  

    // Carol (UserID 3)
    { UserID: 3, InterestID: 3 },   
    { UserID: 3, InterestID: 11 }   
  ]);
};
