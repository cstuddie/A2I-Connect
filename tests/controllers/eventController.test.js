const eventController = require('../../src/controllers/eventController');
const eventService = require('../../src/services/eventService');

jest.mock('../../src/services/eventService', () => ({
  getAllEvents: jest.fn(),
  getCourseColumnsForField: jest.fn(),
  getEventsByUser: jest.fn(),
  getEventByID: jest.fn(),
  searchEvents: jest.fn(),
  requestSpeaker: jest.fn(),
  recommendedEvents: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Event Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllEvents', () => {
    it('should return 200 with all events', async () => {
      const events = [{ ID: 1, Topic: 'Talk' }];
      eventService.getAllEvents.mockResolvedValue(events);
      const res = mockRes();

      await eventController.getAllEvents({}, res);

      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should return 500 on service error', async () => {
      eventService.getAllEvents.mockRejectedValue(new Error('DB error'));
      const res = mockRes();

      await eventController.getAllEvents({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occured on events' });
    });
  });

  describe('getEventsForUser', () => {
    it('should return 200 with events for the user', async () => {
      const events = [{ ID: 1, RequesterID: 5 }];
      eventService.getEventsByUser.mockResolvedValue(events);
      const req = { params: { userID: '5' } };
      const res = mockRes();

      await eventController.getEventsForUser(req, res);

      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should return 500 on service error', async () => {
      eventService.getEventsByUser.mockRejectedValue(new Error('DB error'));
      const req = { params: { userID: '5' } };
      const res = mockRes();

      await eventController.getEventsForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch events' });
    });
  });

  describe('getEventByID', () => {
    it('should return 200 with the event', async () => {
      const event = { ID: 1, Topic: 'Talk' };
      eventService.getEventByID.mockResolvedValue(event);
      const req = { params: { eventID: '1' } };
      const res = mockRes();

      await eventController.getEventByID(req, res);

      expect(res.json).toHaveBeenCalledWith(event);
    });

    it('should return 404 when event is not found', async () => {
      eventService.getEventByID.mockResolvedValue(null);
      const req = { params: { eventID: '999' } };
      const res = mockRes();

      await eventController.getEventByID(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
    });

    it('should return 500 on service error', async () => {
      eventService.getEventByID.mockRejectedValue(new Error('DB error'));
      const req = { params: { eventID: '1' } };
      const res = mockRes();

      await eventController.getEventByID(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch event' });
    });
  });

  describe('searchEvents', () => {
    it('should return 200 with matching events', async () => {
      const events = [{ ID: 1, Topic: 'Machine Learning' }];
      eventService.searchEvents.mockResolvedValue(events);
      const req = { params: { term: 'Machine' } };
      const res = mockRes();

      await eventController.searchEvents(req, res);

      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should return 500 on service error', async () => {
      eventService.searchEvents.mockRejectedValue(new Error('DB error'));
      const req = { params: { term: 'test' } };
      const res = mockRes();

      await eventController.searchEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('requestSpeaker', () => {
    it('should return 201 with eventID on success', async () => {
      eventService.requestSpeaker.mockResolvedValue(42);
      const req = { body: { RequesterID: 1, Topic: 'AI Talk' } };
      const res = mockRes();

      await eventController.requestSpeaker(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event request submitted successfully',
        eventID: 42,
      });
    });

    it('should return 500 on service error', async () => {
      eventService.requestSpeaker.mockRejectedValue(new Error('DB error'));
      const req = { body: {} };
      const res = mockRes();

      await eventController.requestSpeaker(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while submitting your request.' });
    });
  });

  describe('recommendedEvents', () => {
    it('should return 200 with recommended events', async () => {
      const events = [{ ID: 1, course: 'intro_cs' }];
      eventService.recommendedEvents.mockResolvedValue(events);
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await eventController.recommendedEvents(req, res);

      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should return 500 on service error', async () => {
      eventService.recommendedEvents.mockRejectedValue(new Error('DB error'));
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await eventController.recommendedEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occured on recEvents' });
    });
  });

  describe('getCourseColumnsForField', () => {
    it('should return 200 with column names', async () => {
      const cols = ['intro_cs', 'data_structures'];
      eventService.getCourseColumnsForField.mockResolvedValue(cols);
      const req = { params: { field: 'Computer Science' } };
      const res = mockRes();

      await eventController.getCourseColumnsForField(req, res);

      expect(res.json).toHaveBeenCalledWith(cols);
    });

    it('should return 400 when field is invalid (null returned)', async () => {
      eventService.getCourseColumnsForField.mockResolvedValue(null);
      const req = { params: { field: 'Invalid Field' } };
      const res = mockRes();

      await eventController.getCourseColumnsForField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid field' });
    });

    it('should return 500 on service error', async () => {
      eventService.getCourseColumnsForField.mockRejectedValue(new Error('DB error'));
      const req = { params: { field: 'Computer Science' } };
      const res = mockRes();

      await eventController.getCourseColumnsForField(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
