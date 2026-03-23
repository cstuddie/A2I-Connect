const request = require('supertest');
const express = require('express');

jest.mock('../../db/knex', () => jest.fn());
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), verify: jest.fn() }));

const db = require('../../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRoutes = require('../../src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes - POST /api/auth/register', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return 201 on successful registration', async () => {
    db.mockImplementationOnce(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    })).mockImplementationOnce(() => ({
      insert: jest.fn().mockResolvedValue([1]),
    }));
    bcrypt.hash.mockResolvedValue('hashedpw');
    jwt.sign.mockReturnValue('token123');

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'secret',
        role: 'Instructor',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when email already exists', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ ID: 1, Email: 'dup@example.com' }),
    }));

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'dup@example.com',
        password: 'secret',
        role: 'Instructor',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email already exists');
  });
});

describe('Auth Routes - POST /api/auth/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return 200 with token on valid credentials', async () => {
    const user = { ID: 1, Email: 'jane@example.com', FirstName: 'Jane', LastName: 'Doe', Password: 'hash' };
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(user),
    }));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token123');

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'secret' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('jane@example.com');
  });

  it('should return 400 when user is not found', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    }));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 400 when password is incorrect', async () => {
    const user = { ID: 1, Email: 'jane@example.com', Password: 'hash' };
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(user),
    }));
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'wrong' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
