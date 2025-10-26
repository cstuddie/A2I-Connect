const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db/knex');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await db('admin').where({ email }).first();
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    if (password !== admin.password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { admin: { id: admin.adminID } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, admin: { id: admin.adminID, email: admin.email } });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// GET /admin/verify (protected)
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ message: 'Admin verified', adminID: req.admin.id });
});

module.exports = router;
