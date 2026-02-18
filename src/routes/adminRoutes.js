const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db/knex');
const { requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('User').where({ Email: email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.IsAdmin) return res.status(403).json({ message: 'Not authorized as admin' });

    const token = jwt.sign(
      { user: { id: user.ID }, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.ID, email: user.Email } });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// GET /admin/verify (protected)
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ message: 'Admin verified', userID: req.user.id });
});

// User management
router.delete('/users/:userID', requireAdmin, adminController.deleteUser);
router.post('/users/:userID/ban', requireAdmin, adminController.banUser);

module.exports = router;
