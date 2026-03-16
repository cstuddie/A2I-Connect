const request = require('supertest');
const express = require('express');
const adminRoutes = require('../../src/routes/adminRoutes');

jest.mock('../../src/middleware/auth', () => ({
  requireAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {

  test('DELETE /admin/users/:userID', async () => {

    const response = await request(app)
      .delete('/admin/users/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

  });

});