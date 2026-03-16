const adminController = require('../../src/controllers/adminController');
const adminService = require('../../src/services/adminService');

jest.mock('../../src/services/adminService');

describe('Admin Controller - deleteUser', () => {

  test('should delete a user successfully', async () => {

    adminService.deleteUserCascade.mockResolvedValue();

    const req = {
      params: { userID: 1 }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await adminController.deleteUser(req, res);

    expect(adminService.deleteUserCascade).toHaveBeenCalledWith(1);

    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully'
    });
  });

  test('should return 500 on error', async () => {

    adminService.deleteUserCascade.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { userID: 1 }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await adminController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Error deleting user'
    });
  });

});