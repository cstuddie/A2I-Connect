/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('Expertise').del();

  await knex('Expertise').insert([
    { Field: 1, Title: 'Web Development' },
    { Field: 2, Title: 'Data Science' },
    { Field: 3, Title: 'AI & Machine Learning' },
    { Field: 4, Title: 'Cybersecurity' }
  ]);
};
