const adminService = require('../../src/services/adminService');
const db = require('../../db/knex');

jest.mock('../../db/knex', () => jest.fn());

describe('Admin Service', () => {

  test('deleteUserCascade deletes interests, profile, and user', async () => {

    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockResolvedValue()
    }));

    await adminService.deleteUserCascade(1);

    expect(db).toHaveBeenCalledWith('interests');
    expect(db).toHaveBeenCalledWith('profile');
    expect(db).toHaveBeenCalledWith('users');
  });

});

describe('Admin Service - updateEvent', () => {
  afterEach(() => jest.clearAllMocks());

  test('updateEvent should update event and return rows affected', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue(1),
    }));

    const result = await adminService.updateEvent(1, { EventStatus: 'Completed' });
    expect(result).toBe(1);
    expect(db).toHaveBeenCalledWith('events');
  });

  test('updateEvent should throw on DB error', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      update: jest.fn().mockRejectedValue(new Error('DB error')),
    }));

    await expect(adminService.updateEvent(1, {})).rejects.toThrow('DB error');
  });
});

describe('Admin Service - getAdmin', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAdmin should return admin record when found', async () => {
    const admin = { adminID: 1, email: 'admin@test.com' };
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(admin),
    }));

    const result = await adminService.getAdmin(1);
    expect(result).toEqual(admin);
    expect(db).toHaveBeenCalledWith('admin');
  });

  test('getAdmin should return undefined when admin not found', async () => {
    db.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(undefined),
    }));

    const result = await adminService.getAdmin(999);
    expect(result).toBeUndefined();
  });
});