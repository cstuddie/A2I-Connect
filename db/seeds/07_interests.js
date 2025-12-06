/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('interests').del();

  const users = await knex('users')
    .select('userID')
    .orderBy('userID')
    .limit(3);

  if (users.length === 0) {
    console.log('07_interests: no users found, skipping interests seed');
    return;
  }

  const [u1, u2, u3] = users;

  const rows = [];

  // User 1: CS + Data Science
  if (u1) {
    rows.push({
      userID: u1.userID,
      'Computer Science': 1,
      'Data Science': 1
    });
  }

  // User 2: Mathematics + Art
  if (u2) {
    rows.push({
      userID: u2.userID,
      'Mathematics': 1,
      'Art': 1
    });
  }

  // User 3: Physics + Computer Science
  if (u3) {
    rows.push({
      userID: u3.userID,
      'Physics': 1,
      'Computer Science': 1
    });
  }

  if (rows.length > 0) {
    await knex('interests').insert(rows);
  }
};
