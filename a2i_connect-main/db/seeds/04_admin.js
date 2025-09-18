/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('admin').del()
  await knex('admin').insert([
    { adminID: 1,
      email: 'admin1@example.com',
      password: 'AdminPass!123',
    },
    { adminID: 2,
      email: 'admin2@example.com',
      password: 'SecureAdmin!456',
    },
    { adminID: 3,
      email: 'admin3@example.com',
      password: 'AdminAccess!789',
    },
  ]);
};
