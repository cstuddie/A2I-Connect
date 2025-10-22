const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;         // adjust fields if needed
    const userID = await authService.register({ email, password, name });
    res.status(201).json({ userID });
  } catch (e) {
    res.status(400).json({ message: e.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.json({ token, user });
  } catch (e) {
    res.status(401).json({ message: e.message || 'Login failed' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
