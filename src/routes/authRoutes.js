// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db/knex');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isHashed = typeof user.password === 'string' && user.password.startsWith('$2b$');
    const ok = isHashed ? await bcrypt.compare(password, user.password) : password === user.password;
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user: { id: user.userID } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.userID, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password /*, name*/ } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [userID] = await db('users').insert({ email, password: hashed });

    return res.status(201).json({ userID });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;
