const request = require('supertest');
const express = require('express');

jest.mock('../../src/controllers/eventController', () => ({
  getAllEvents: jest.fn((req, res) => res.status(200).json([])),
  getEventsForUser: jest.fn((req, res) => res.status(200).json([])),
  recommendedEvents: jest.fn((req, res) => res.status(200).json([])),
  getCourseColumnsForField: jest.fn((req, res) => res.status(200).json([])),
  searchEvents: jest.fn((req, res) => res.status(200).json([])),
  getEventByID: jest.fn((req, res) => res.status(200).json({ ID: 1 })),
  requestSpeaker: jest.fn((req, res) => res.status(201).json({ eventID: 1 })),
}));

const eventRoutes = require('../../src/routes/eventRoutes');
const eventController = require('../../src/controllers/eventController');

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event Routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /events should call getAllEvents and return 200', async () => {
    const response = await request(app).get('/events');
    expect(response.statusCode).toBe(200);
    expect(eventController.getAllEvents).toHaveBeenCalled();
  });

  it('GET /events/user/:userID should call getEventsForUser and return 200', async () => {
    const response = await request(app).get('/events/user/1');
    expect(response.statusCode).toBe(200);
    expect(eventController.getEventsForUser).toHaveBeenCalled();
  });

  it('GET /events/recommended/:userID should call recommendedEvents and return 200', async () => {
    const response = await request(app).get('/events/recommended/1');
    expect(response.statusCode).toBe(200);
    expect(eventController.recommendedEvents).toHaveBeenCalled();
  });

  it('GET /events/event-call-courses/:field should call getCourseColumnsForField and return 200', async () => {
    const response = await request(app).get('/events/event-call-courses/Computer%20Science');
    expect(response.statusCode).toBe(200);
    expect(eventController.getCourseColumnsForField).toHaveBeenCalled();
  });

  it('GET /events/topic/:term should call searchEvents and return 200', async () => {
    const response = await request(app).get('/events/topic/AI');
    expect(response.statusCode).toBe(200);
    expect(eventController.searchEvents).toHaveBeenCalled();
  });

  it('GET /events/:eventID should call getEventByID and return 200', async () => {
    const response = await request(app).get('/events/42');
    expect(response.statusCode).toBe(200);
    expect(eventController.getEventByID).toHaveBeenCalled();
  });

  it('POST /events should call requestSpeaker and return 201', async () => {
    const response = await request(app)
      .post('/events')
      .send({ RequesterID: 1, Topic: 'AI Talk' });
    expect(response.statusCode).toBe(201);
    expect(eventController.requestSpeaker).toHaveBeenCalled();
  });
});
