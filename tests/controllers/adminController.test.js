const adminController = require('../../src/controllers/adminController');
const adminService = require('../../src/services/adminService');

jest.mock('../../src/services/adminService', () => ({
  deleteUserCascade: jest.fn(),
  updateEvent: jest.fn(),
  getAdmin: jest.fn(),
}));

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

describe('Admin Controller - updateEventStatus', () => {
  afterEach(() => jest.clearAllMocks());

  test('should update event status successfully', async () => {
    adminService.updateEvent.mockResolvedValue(1);
    const req = { params: { eventID: '1' }, body: { EventStatus: 'Completed' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await adminController.updateEventStatus(req, res);

    expect(adminService.updateEvent).toHaveBeenCalledWith('1', { EventStatus: 'Completed' });
    expect(res.json).toHaveBeenCalledWith({ message: 'Event updated successfully' });
  });

  test('should return 500 on error', async () => {
    adminService.updateEvent.mockRejectedValue(new Error('DB error'));
    const req = { params: { eventID: '1' }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await adminController.updateEventStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error updating event' });
  });
});

describe('Admin Controller - getAdmin', () => {
  afterEach(() => jest.clearAllMocks());

  test('should return admin details on success', async () => {
    const admin = { adminID: 1, email: 'admin@test.com', password: 'secret' };
    adminService.getAdmin.mockResolvedValue(admin);
    const req = { params: { adminID: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await adminController.getAdmin(req, res);

    expect(res.json).toHaveBeenCalled();
    const returned = res.json.mock.calls[0][0];
    expect(returned.password).toBeUndefined();
    expect(returned.email).toBe('admin@test.com');
  });

  test('should return 404 when admin is not found', async () => {
    adminService.getAdmin.mockResolvedValue(null);
    const req = { params: { adminID: '999' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await adminController.getAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin not found' });
  });

  test('should return 500 on error', async () => {
    adminService.getAdmin.mockRejectedValue(new Error('DB error'));
    const req = { params: { adminID: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await adminController.getAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching admin details' });
  });
});