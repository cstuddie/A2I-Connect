/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('Reviews').del();

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
