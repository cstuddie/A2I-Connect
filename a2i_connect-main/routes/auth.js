const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = function(db) {
  // Login route
  router.post('/login', async (req, res) => {
    console.log('Login attempt received:', req.body);
    
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await db('users').where({ email }).first();
      console.log('User found:', user);

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if password is hashed (starts with $2b$) or plaintext (for seeded users)
      const isPasswordHashed = user.password.startsWith('$2b$');
      let isMatch = false;

      if (isPasswordHashed) {
        // Compare hashed password
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // Compare plaintext password (for seeded users)
        isMatch = password === user.password;
      }
      
      if (isMatch) {
        console.log('Password match successful');
        // Create JWT payload
        const payload = {
          user: {
            id: user.userID
          }
        };

        // Sign token
        jwt.sign(
          payload,
          process.env.JWT_SECRET || 'your_secret_key',
          { expiresIn: '1h' },
          (err, token) => {
            if (err) throw err;
            res.json({ 
              token,
              user: {
                id: user.userID,
                email: user.email
              }
            });
          }
        );
      } else {
        console.log('Password mismatch');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });
  
  return router;
};