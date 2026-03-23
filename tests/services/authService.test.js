const authService = require('../../src/services/authService');
const db = require('../../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../db/knex', () => jest.fn());
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), verify: jest.fn() }));

describe('Auth Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a new user and return userID', async () => {
      db.mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      })).mockImplementationOnce(() => ({
        insert: jest.fn().mockResolvedValue([42]),
      }));
      bcrypt.hash.mockResolvedValue('hashedpassword');

      const userID = await authService.register({ email: 'test@example.com', password: 'secret', name: 'Test User' });
      expect(userID).toBe(42);
    });

    it('should throw if email or password is missing', async () => {
      await expect(authService.register({ email: '', password: '' })).rejects.toThrow('Email and password required');
    });

    it('should throw if email is already in use', async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ userID: 1, email: 'test@example.com' }),
      }));

      await expect(
        authService.register({ email: 'test@example.com', password: 'secret' })
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    it('should return token and user payload on valid credentials', async () => {
      const fakeUser = { userID: 1, email: 'test@example.com', passwordHash: 'hash', isAdmin: 0 };
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(fakeUser),
      }));
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      const result = await authService.login('test@example.com', 'secret');
      expect(result.token).toBe('fake-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.userID).toBe(1);
    });

    it('should throw if user is not found', async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      }));

      await expect(authService.login('nobody@example.com', 'secret')).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password is incorrect', async () => {
      const fakeUser = { userID: 1, email: 'test@example.com', passwordHash: 'hash' };
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(fakeUser),
      }));
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });
});
