const db = require('../../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_TABLE = 'users';     

exports.register = async ({ email, password, name }) => {
  if (!email || !password) throw new Error('Email and password required');

  const existing = await db(USERS_TABLE).where({ email }).first();
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);

  // Adjust columns to match your schema (e.g., name/affiliation/etc.)
  const [userID] = await db(USERS_TABLE).insert({ email, passwordHash, name });
  return userID;
};

exports.login = async (email, password) => {
  const user = await db(USERS_TABLE).where({ email }).first();
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) throw new Error('Invalid credentials');

  // add admin flag if your schema has it, e.g., user.isAdmin
  const payload = { userID: user.userID, email: user.email, admin: !!user.isAdmin };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

  return { token, user: payload };
};
