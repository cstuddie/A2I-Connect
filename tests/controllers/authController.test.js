const authController = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');

jest.mock('../../src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should return 201 with userID on successful registration', async () => {
      authService.register.mockResolvedValue(5);
      const req = { body: { email: 'test@example.com', password: 'secret', name: 'Test' } };
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ userID: 5 });
    });

    it('should return 400 with error message on failure', async () => {
      authService.register.mockRejectedValue(new Error('Email already in use'));
      const req = { body: { email: 'dup@example.com', password: 'secret' } };
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });
  });

  describe('login', () => {
    it('should return 200 with token and user on successful login', async () => {
      const payload = { token: 'jwt-token', user: { userID: 1, email: 'test@example.com' } };
      authService.login.mockResolvedValue(payload);
      const req = { body: { email: 'test@example.com', password: 'secret' } };
      const res = mockRes();

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(payload);
    });

    it('should return 401 with error message on failed login', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));
      const req = { body: { email: 'test@example.com', password: 'wrong' } };
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('me', () => {
    it('should return the current user from req.user', async () => {
      const req = { user: { userID: 1, email: 'test@example.com' } };
      const res = mockRes();

      await authController.me(req, res);

      expect(res.json).toHaveBeenCalledWith({ user: req.user });
    });
  });
});
