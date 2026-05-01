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

exports.getEventsForUser = async (req, res) => {
  const userID = req.params.userID;
  try {
    const events = await eventService.getEventsByUser(userID);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.requestSpeaker = async (req, res) => {
  try {
    const eventID = await eventService.requestSpeaker(req.body);
    res.status(201).json({ 
      message: 'Event request submitted successfully', 
      eventID 
    });
  } catch (e) {
    console.error('Error creating event:', e);
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

exports.searchEvents = async (req, res) => {
  const { term } = req.params;
    try {
      const events = await eventService.searchEvents(term);
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
}

exports.getEventByID = async (req, res) => {
  const { eventID } = req.params;

  try {
    const event = await eventService.getEventByID(eventID);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('Fetch event error:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

exports.acceptEvent = async (req, res) => {
  const { eventID } = req.params;
  const { speakerID } = req.body;

  if (!speakerID) return res.status(400).json({ error: 'speakerID is required' });

  try {
    const result = await eventService.acceptEvent({
      eventID: parseInt(eventID),
      speakerID: parseInt(speakerID)
    });
    res.json(result);
  } catch (e) {
    console.error('Accept event error:', e);
    const status = e.message === 'Event not found' ? 404
                 : e.message === 'Event already accepted' ? 409
                 : 500;
    res.status(status).json({ error: e.message });
  }
};

