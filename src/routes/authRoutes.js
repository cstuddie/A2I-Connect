const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db/knex');

const router = express.Router();

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
      affiliation,
      preferredLanguage
    } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const banned = await db("Banned").where({ Email: email }).first();
    if (banned) {
      return res.status(403).json({ error: "This email has been banned" });
    }

    const existing = await db("User").where({ Email: email }).first();
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db("User").insert({
      Email: email,
      Password: hashedPassword,
      Role: role,
      FirstName: firstName,
      LastName: lastName,
      ExpertiseID: expertiseID || null,
      Bio: bio || null,
      Status: 1,
      Affiliation: affiliation || null,
      PreferredLanguage: preferredLanguage || 'en'
    });

    const token = jwt.sign(
      { user: { id: userId } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db("User").where({ Email: email }).first();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user: { id: user.ID } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.ID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        preferredLanguage: user.PreferredLanguage || 'en'
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
