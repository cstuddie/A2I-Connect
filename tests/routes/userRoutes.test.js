const request = require('supertest');
const express = require('express');

jest.mock('../../src/controllers/userController', () => ({
  getExpertise: jest.fn((req, res) => res.status(200).json([])),
  getAllProfiles: jest.fn((req, res) => res.status(200).json([])),
  getTrueInterests: jest.fn((req, res) => res.status(200).json([])),
  getInterestsByUser: jest.fn((req, res) => res.status(200).json({})),
  getAllInterests: jest.fn((req, res) => res.status(200).json([])),
  getCoursesByUser: jest.fn((req, res) => res.status(200).json({})),
  getProfileByID: jest.fn((req, res) => res.status(200).json({ ID: 1 })),
  updateProfile: jest.fn((req, res) => res.status(200).json({ message: 'Profile updated successfully' })),
}));

const userRoutes = require('../../src/routes/userRoutes');
const userController = require('../../src/controllers/userController');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /users/expertise should call getExpertise and return 200', async () => {
    const response = await request(app).get('/users/expertise');
    expect(response.statusCode).toBe(200);
    expect(userController.getExpertise).toHaveBeenCalled();
  });

  it('GET /users should call getAllProfiles and return 200', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(userController.getAllProfiles).toHaveBeenCalled();
  });

  it('GET /users/trueInterests/:userID should call getTrueInterests and return 200', async () => {
    const response = await request(app).get('/users/trueInterests/1');
    expect(response.statusCode).toBe(200);
    expect(userController.getTrueInterests).toHaveBeenCalled();
  });

  it('GET /users/interests/:userID should call getInterestsByUser and return 200', async () => {
    const response = await request(app).get('/users/interests/1');
    expect(response.statusCode).toBe(200);
    expect(userController.getInterestsByUser).toHaveBeenCalled();
  });

  it('GET /users/allInterests should call getAllInterests and return 200', async () => {
    const response = await request(app).get('/users/allInterests');
    expect(response.statusCode).toBe(200);
    expect(userController.getAllInterests).toHaveBeenCalled();
  });

  it('GET /users/courses/:userID should call getCoursesByUser and return 200', async () => {
    const response = await request(app).get('/users/courses/1');
    expect(response.statusCode).toBe(200);
    expect(userController.getCoursesByUser).toHaveBeenCalled();
  });

  it('GET /users/:id should call getProfileByID and return 200', async () => {
    const response = await request(app).get('/users/1');
    expect(response.statusCode).toBe(200);
    expect(userController.getProfileByID).toHaveBeenCalled();
  });

  it('PUT /users/:id should call updateProfile and return 200', async () => {
    const response = await request(app)
      .put('/users/1')
      .send({ FirstName: 'Jane', LastName: 'Doe' });
    expect(response.statusCode).toBe(200);
    expect(userController.updateProfile).toHaveBeenCalled();
  });
});
