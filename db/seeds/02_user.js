/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('User').del();

  await knex('User').insert([
    {
      Email: 'alice@example.com',
      Password: 'password123',
      Role: 1,
      FirstName: 'Alice',
      LastName: 'Johnson',
      ExpertiseID: 1,
      Bio: 'Front-end developer with 5 years of experience.',
      Rating: 4.5,
      Status: 1,
      Affiliation: 'Tech Co.'
    },
    {
      Email: 'bob@example.com',
      Password: 'password123',
      Role: 2,
      FirstName: 'Bob',
      LastName: 'Smith',
      ExpertiseID: 2,
      Bio: 'Data scientist who loves Python and R.',
      Rating: 4.7,
      Status: 1,
      Affiliation: 'Data Inc.'
    },
    {
      Email: 'carol@example.com',
      Password: 'password123',
      Role: 1,
      FirstName: 'Carol',
      LastName: 'Williams',
      ExpertiseID: 3,
      Bio: 'Machine learning enthusiast.',
      Rating: 4.8,
      Status: 1,
      Affiliation: 'AI Labs'
    }
  ]);
};
