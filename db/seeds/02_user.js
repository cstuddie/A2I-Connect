const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('UserInterests').truncate().catch(() => {});
  await knex('User').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await knex('User').insert([
    {
      Email: 'alice@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Alice',
      LastName: 'Johnson',
      ExpertiseID: 1,
      Bio: 'Front-end developer with 5 years of experience.',
      Rating: 4.5,
      Status: 1,
      Affiliation: 'Tech Co.',
      IsAdmin: false
    },
    {
      Email: 'bob@example.com',
      Password: hashedPassword,
      Role: 2,
      FirstName: 'Bob',
      LastName: 'Smith',
      ExpertiseID: 2,
      Bio: 'Data scientist who loves Python and R.',
      Rating: 4.7,
      Status: 1,
      Affiliation: 'Data Inc.',
      IsAdmin: false
    },
    {
      Email: 'carol@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Carol',
      LastName: 'Williams',
      ExpertiseID: 3,
      Bio: 'Machine learning enthusiast.',
      Rating: 4.8,
      Status: 1,
      Affiliation: 'AI Labs',
      IsAdmin: false
    },
    {
      Email: 'admin@a2iconnect.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Admin',
      LastName: 'User',
      ExpertiseID: null,
      Bio: 'System administrator.',
      Rating: null,
      Status: 1,
      Affiliation: 'A2I Connect',
      IsAdmin: true
    }
  ]);
};
