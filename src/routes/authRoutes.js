const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, affiliation, expertiseID, bio } = req.body;
    const userID = await authService.register({ firstName, lastName, email, password, affiliation, expertiseID, bio });
    res.status(201).json({ userID });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login (optional, already working)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: err.message || 'Login failed' });
  }
});

module.exports = router;
