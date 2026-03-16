const adminService = require('../../src/services/adminService');
const db = require('../../db/knex');

jest.mock('../../db/knex');

describe('Admin Service', () => {

  test('deleteUserCascade deletes interests and user', async () => {

    db.mockImplementation((table) => {
      if (table === 'UserInterests') {
        return {
          where: jest.fn().mockReturnThis(),
          del: jest.fn().mockResolvedValue()
        };
      }

      if (table === 'User') {
        return {
          where: jest.fn().mockReturnThis(),
          del: jest.fn().mockResolvedValue()
        };
      }
    });

    await adminService.deleteUserCascade(1);

    expect(db).toHaveBeenCalledWith('UserInterests');
    expect(db).toHaveBeenCalledWith('User');
  });

});