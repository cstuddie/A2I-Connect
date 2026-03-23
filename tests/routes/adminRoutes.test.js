const request = require('supertest');
const express = require('express');

jest.mock('../../src/middleware/auth', () => ({
  requireAdmin: (req, res, next) => { req.admin = { id: 1 }; next(); }
}));
jest.mock('../../db/knex', () => jest.fn());
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), verify: jest.fn() }));

const db = require('../../db/knex');
const jwt = require('jsonwebtoken');
const adminRoutes = require('../../src/routes/adminRoutes');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {

  test('DELETE /admin/users/:userID returns 404 (route not defined in adminRoutes)', async () => {

    const response = await request(app)
      .delete('/admin/users/1');

    expect(response.statusCode).toBe(404);

  });

});

describe('Admin Routes - POST /admin/admin-login', () => {
  afterEach(() => jest.clearAllMocks());

  test('should return 200 with token on valid credentials', async () => {
    const admin = { adminID: 1, email: 'admin@test.com', password: 'correct' };
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(admin),
    }));
    jwt.sign.mockReturnValue('admin-token');

    const response = await request(app)
      .post('/admin/admin-login')
      .send({ email: 'admin@test.com', password: 'correct' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('admin-token');
    expect(response.body.admin.id).toBe(1);
  });

  test('should return 400 when admin is not found', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    }));

    const response = await request(app)
      .post('/admin/admin-login')
      .send({ email: 'nobody@test.com', password: 'secret' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  test('should return 400 when password is incorrect', async () => {
    const admin = { adminID: 1, email: 'admin@test.com', password: 'correct' };
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(admin),
    }));

    const response = await request(app)
      .post('/admin/admin-login')
      .send({ email: 'admin@test.com', password: 'wrong' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});

describe('Admin Routes - GET /admin/verify', () => {
  test('should return 200 with adminID when token is valid', async () => {
    const response = await request(app).get('/admin/verify');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Admin verified');
    expect(response.body.adminID).toBe(1);
  });
});