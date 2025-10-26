const eventService = require('../services/eventService');

exports.getAllEvents = async (_req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch {
    res.status(500).json({ error: 'An error occured on events' });
  }
};

exports.getCourseColumnsForField = async (req, res) => {
  try {
    const cols = await eventService.getCourseColumnsForField(req.params.field);
    if (!cols) return res.status(400).json({ error: 'Invalid field' });
    res.json(cols);
  } catch (e) {
    console.error('Course fetch error:', e);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.requestSpeaker = async (req, res) => {
  try {
    const requestID = await eventService.requestSpeaker(req.body);
    res.status(201).json({ message: 'Speaker request submitted successfully', requestID });
  } catch (e) {
    console.error('Database error:', e);
    res.status(500).json({ error: 'An error occurred while submitting your request.' });
  }
};

exports.recommendedEvents = async (req, res) => {
  try {
    const data = await eventService.recommendedEvents(req.params.userID);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'An error occured on recEvents' });
  }
};
