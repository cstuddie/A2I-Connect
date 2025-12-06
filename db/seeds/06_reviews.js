/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Reviews').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Reviews').insert([
    {
      Date: new Date(),
      Content: 'Alice was very clear in her explanations.',
      ReviewerID: 2,
      AssociatedEventID: 1,
      RecieverID: 1
    },
    {
      Date: new Date(),
      Content: 'Bob provided excellent guidance on data analysis.',
      ReviewerID: 3,
      AssociatedEventID: 2,
      RecieverID: 2
    }
  ]);
};
