/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Message').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Message').insert([
    {
      TimeStamp: new Date(),
      Content: 'Hi Bob, can you help me with React?',
      SenderID: 1,
      ConversationID: 1,
      Read: false
    },
    {
      TimeStamp: new Date(),
      Content: 'Sure Alice, let’s schedule a call.',
      SenderID: 2,
      ConversationID: 1,
      Read: false
    }
  ]);
};
