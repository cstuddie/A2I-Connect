const userService = require('../services/userService');

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await userService.getAllProfiles();
    res.json(profiles || []);
  } catch (e) {
    console.error('Error fetching profiles:', e);
    res.status(500).json({ error: 'An error occurred on profiles', details: e.message });
  }
};

exports.getTrueInterests = async (req, res) => {
  try {
    const list = await userService.getTrueInterests(req.params.userID);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'An error occured on interests' });
  }
};

exports.getInterestsByUser = async (req, res) => {
  try {
    const data = await userService.getInterestsByUser(req.params.userID);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'An error occured on interests' });
  }
};

exports.getAllInterests = async (_req, res) => {
  try {
    const cols = await userService.getAllInterests();
    if (!cols?.length) return res.status(404).json({ message: 'No interests found.' });
    res.json(cols);
  } catch (e) {
    console.error('Error fetching interests:', e);
    res.status(500).json({ error: 'An error occurred fetching all interests.' });
  }
};

exports.getCoursesByUser = async (req, res) => {
  try {
    const courses = await userService.getCoursesByUser(req.params.userID);
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'An error occured on courses' });
  }
};
