const db = require('../../db/knex');
const bcrypt = require('bcrypt');

const USERS_TABLE = 'User';  // matches your new DB table
const EXPERTISE_TABLE = 'Expertise';

exports.register = async ({ firstName, lastName, email, password, affiliation, expertiseID, bio }) => {
  if (!email || !password || !firstName || !lastName) {
    throw new Error('First name, last name, email, and password are required');
  }

  // Check if email already exists
  const existing = await db(USERS_TABLE).where({ Email: email }).first();
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);

  // Insert new user
  const [userID] = await db(USERS_TABLE).insert({
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: passwordHash,
    Affiliation: affiliation,
    ExpertiseID: expertiseID || null,
    Bio: bio || '',
    Role: 2,          // default role (e.g., 2 = regular user)
    Status: 1         // active user
  });

  return userID;
};

exports.login = async (email, password) => {
  const user = await db(USERS_TABLE).where({ Email: email }).first();
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.Password);
  if (!ok) throw new Error('Invalid credentials');

  return user; // you can sign JWT in route if needed
};
