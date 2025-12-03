/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('Event').del();

  await knex('Event').insert([
    {
      RequesterID: 1,
      Topic: 'Build a React App',
      Description: 'Looking for guidance on building a React application.',
      Date: '2025-12-10',
      EventStatus: 1,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 2,
      Topic: 'Data Analysis with Python',
      Description: 'Need help cleaning and analyzing a dataset.',
      Date: '2025-12-15',
      EventStatus: 1,
      ExpertiseID: 2,
      DeliveryMethod: 'In-person'
    }
  ]);
};
