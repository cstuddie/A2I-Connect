/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('Conversation').del();

  await knex('Conversation').insert([
    { InitiatorID: 1, RecieverID: 2, AssociatedEventID: 1 },
    { InitiatorID: 2, RecieverID: 3, AssociatedEventID: 2 }
  ]);
};
