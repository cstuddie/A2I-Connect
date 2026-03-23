const userController = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');

jest.mock('../../src/services/userService', () => ({
  getAllProfiles: jest.fn(),
  getProfileByID: jest.fn(),
  getExpertise: jest.fn(),
  getTrueInterests: jest.fn(),
  getInterestsByUser: jest.fn(),
  getAllInterests: jest.fn(),
  getCoursesByUser: jest.fn(),
  updateProfile: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllProfiles', () => {
    it('should return 200 with all profiles', async () => {
      const profiles = [{ ID: 1, FirstName: 'Jane' }];
      userService.getAllProfiles.mockResolvedValue(profiles);
      const res = mockRes();

      await userController.getAllProfiles({}, res);

      expect(res.json).toHaveBeenCalledWith(profiles);
    });

    it('should return 500 on service error', async () => {
      userService.getAllProfiles.mockRejectedValue(new Error('DB error'));
      const res = mockRes();

      await userController.getAllProfiles({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProfileByID', () => {
    it('should return 200 with the profile', async () => {
      const profile = { ID: 1, FirstName: 'Jane' };
      userService.getProfileByID.mockResolvedValue(profile);
      const req = { params: { id: '1' } };
      const res = mockRes();

      await userController.getProfileByID(req, res);

      expect(res.json).toHaveBeenCalledWith(profile);
    });

    it('should return 404 when profile is not found', async () => {
      userService.getProfileByID.mockResolvedValue(null);
      const req = { params: { id: '999' } };
      const res = mockRes();

      await userController.getProfileByID(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found' });
    });

    it('should return 500 on service error', async () => {
      userService.getProfileByID.mockRejectedValue(new Error('DB error'));
      const req = { params: { id: '1' } };
      const res = mockRes();

      await userController.getProfileByID(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getExpertise', () => {
    it('should return 200 with expertise list', async () => {
      const expertise = [{ ID: 1, Field: 'Computer Science' }];
      userService.getExpertise.mockResolvedValue(expertise);
      const req = { params: {} };
      const res = mockRes();

      await userController.getExpertise(req, res);

      expect(res.json).toHaveBeenCalledWith(expertise);
    });

    it('should return 500 on service error', async () => {
      userService.getExpertise.mockRejectedValue(new Error('DB error'));
      const req = { params: {} };
      const res = mockRes();

      await userController.getExpertise(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getTrueInterests', () => {
    it('should return 200 with list of true interests', async () => {
      const interests = ['sports', 'music'];
      userService.getTrueInterests.mockResolvedValue(interests);
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getTrueInterests(req, res);

      expect(res.json).toHaveBeenCalledWith(interests);
    });

    it('should return 500 on service error', async () => {
      userService.getTrueInterests.mockRejectedValue(new Error('DB error'));
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getTrueInterests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occured on interests' });
    });
  });

  describe('getInterestsByUser', () => {
    it('should return 200 with the interests object', async () => {
      const interests = { userID: 1, sports: 1 };
      userService.getInterestsByUser.mockResolvedValue(interests);
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getInterestsByUser(req, res);

      expect(res.json).toHaveBeenCalledWith(interests);
    });

    it('should return 500 on service error', async () => {
      userService.getInterestsByUser.mockRejectedValue(new Error('DB error'));
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getInterestsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occured on interests' });
    });
  });

  describe('getAllInterests', () => {
    it('should return 200 with list of interest column names', async () => {
      const cols = ['sports', 'music', 'art'];
      userService.getAllInterests.mockResolvedValue(cols);
      const res = mockRes();

      await userController.getAllInterests({}, res);

      expect(res.json).toHaveBeenCalledWith(cols);
    });

    it('should return 404 when no interests are found', async () => {
      userService.getAllInterests.mockResolvedValue([]);
      const res = mockRes();

      await userController.getAllInterests({}, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No interests found.' });
    });

    it('should return 500 on service error', async () => {
      userService.getAllInterests.mockRejectedValue(new Error('DB error'));
      const res = mockRes();

      await userController.getAllInterests({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getCoursesByUser', () => {
    it('should return 200 with courses object', async () => {
      const courses = { intro_cs: true };
      userService.getCoursesByUser.mockResolvedValue(courses);
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getCoursesByUser(req, res);

      expect(res.json).toHaveBeenCalledWith(courses);
    });

    it('should return 500 on service error', async () => {
      userService.getCoursesByUser.mockRejectedValue(new Error('DB error'));
      const req = { params: { userID: '1' } };
      const res = mockRes();

      await userController.getCoursesByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occured on courses' });
    });
  });

  describe('updateProfile', () => {
    it('should return 200 with updated profile on success', async () => {
      const updatedProfile = { ID: 1, FirstName: 'Jane', LastName: 'Doe' };
      userService.updateProfile.mockResolvedValue(1);
      userService.getProfileByID.mockResolvedValue(updatedProfile);
      const req = { params: { id: '1' }, body: { FirstName: 'Jane', LastName: 'Doe' } };
      const res = mockRes();

      await userController.updateProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        profile: updatedProfile,
      });
    });

    it('should return 400 when required fields are missing', async () => {
      const req = { params: { id: '1' }, body: { FirstName: '', LastName: '' } };
      const res = mockRes();

      await userController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'First name and last name are required' });
    });

    it('should return 500 on service error', async () => {
      userService.updateProfile.mockRejectedValue(new Error('DB error'));
      const req = { params: { id: '1' }, body: { FirstName: 'Jane', LastName: 'Doe' } };
      const res = mockRes();

      await userController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update profile' });
    });
  });
});
