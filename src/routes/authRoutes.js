// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db/knex');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      expertiseID, 
      bio, 
      affiliation 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db('User').where({ Email: email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const [userId] = await db('User').insert({
      Email: email,
      Password: hashedPassword,
      Role: role,
      FirstName: firstName,
      LastName: lastName,
      ExpertiseID: expertiseID || null,
      Bio: bio || null,
      Rating: null,
      Status: 1, // 1 = active
      Affiliation: affiliation || null
    });

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: userId } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'Registration successful',
      token, 
      user: { 
        id: userId, 
        email: email,
        firstName: firstName,
        lastName: lastName
      } 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query with new table name 'User' and column name 'Email'
    const user = await db('User').where({ Email: email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if password is hashed
    const isHashed = typeof user.Password === 'string' && user.Password.startsWith('$2b$');
    const ok = isHashed 
      ? await bcrypt.compare(password, user.Password) 
      : password === user.Password;
    
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user.ID } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.ID, 
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
