const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = function(db) {
  // Admin Login route
  router.post('/admin-login', async (req, res) => {
    console.log('Admin login attempt received:', req.body);
    
    try {
      const { email, password } = req.body;
      
      // Find admin
      const admin = await db('admin').where({ email }).first();
      console.log('Admin found:', admin);

      if (!admin) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // For testing with seed data, use direct password comparison
      // In production, you would use bcrypt.compare
      if (password === admin.password) {
        console.log('Password match successful');
        // Create JWT payload
        const payload = {
          admin: {
            id: admin.adminID
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
              admin: {
                id: admin.adminID,
                email: admin.email
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
  
  // Admin middleware to verify token
  const adminAuth = (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      
      if (!decoded.admin) {
        return res.status(401).json({ message: 'Not authorized as admin' });
      }
      
      // Add admin from payload
      req.admin = decoded.admin;
      next();
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      res.status(401).json({ message: 'Admin token is not valid' });
    }
  };

  // Protected route example
  router.get('/verify', adminAuth, (req, res) => {
    res.json({ message: 'Admin verified', adminID: req.admin.id });
  });
  
  return router;
}