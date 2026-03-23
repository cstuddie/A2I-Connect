const userService = require('../../src/services/userService');
const db = require('../../db/knex');

jest.mock('../../db/knex', () => jest.fn());

describe('User Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllProfiles', () => {
    it('should return all user profiles', async () => {
      const profiles = [{ ID: 1, FirstName: 'Jane' }];
      db.mockReturnValue({ select: jest.fn().mockResolvedValue(profiles) });

      const result = await userService.getAllProfiles();
      expect(result).toEqual(profiles);
      expect(db).toHaveBeenCalledWith('User');
    });

    it('should return empty array when no users exist', async () => {
      db.mockReturnValue({ select: jest.fn().mockResolvedValue([]) });

      const result = await userService.getAllProfiles();
      expect(result).toEqual([]);
    });
  });

  describe('getProfileByID', () => {
    it('should return user when found', async () => {
      const user = { ID: 1, FirstName: 'Jane', LastName: 'Doe' };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(user),
      });

      const result = await userService.getProfileByID(1);
      expect(result).toEqual(user);
    });

    it('should return undefined when user is not found', async () => {
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      });

      const result = await userService.getProfileByID(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getExpertise', () => {
    it('should return all expertise options', async () => {
      const expertise = [{ ID: 1, Field: 'Computer Science' }];
      db.mockReturnValue({ select: jest.fn().mockResolvedValue(expertise) });

      const result = await userService.getExpertise();
      expect(result).toEqual(expertise);
      expect(db).toHaveBeenCalledWith('Expertise');
    });
  });

  describe('getInterestsByUser', () => {
    it('should return the interests record for a user', async () => {
      const interests = { userID: 1, sports: 1, music: 0 };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(interests),
      });

      const result = await userService.getInterestsByUser(1);
      expect(result).toEqual(interests);
    });
  });

  describe('getAllInterests', () => {
    it('should return all interest column names', async () => {
      db.mockResolvedValue([{ userID: 1, sports: 1, music: 0, art: 1 }]);

      const result = await userService.getAllInterests();
      expect(result).toEqual(['userID', 'sports', 'music', 'art']);
    });

    it('should return empty array when no interest records exist', async () => {
      db.mockResolvedValue([]);

      const result = await userService.getAllInterests();
      expect(result).toEqual([]);
    });
  });

  describe('getTrueInterests', () => {
    it('should return interest names where value is 1', async () => {
      const interestsRow = { userID: 1, sports: 1, music: 0, art: 1 };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(interestsRow),
      });

      const result = await userService.getTrueInterests(1);
      expect(result).toEqual(['sports', 'art']);
    });

    it('should return empty array when user has no interests record', async () => {
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      });

      const result = await userService.getTrueInterests(99);
      expect(result).toEqual([]);
    });
  });

  describe('getCoursesByUser', () => {
    it('should return courses where value is 1 for the user', async () => {
      jest.spyOn(userService, 'getTrueInterests').mockResolvedValue(['computer science']);
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ userID: 1, intro_cs: 1, data_structures: 0 }),
      });

      const result = await userService.getCoursesByUser(1);
      expect(result).toEqual({ intro_cs: true });
    });

    it('should return empty object when user has no true interests', async () => {
      jest.spyOn(userService, 'getTrueInterests').mockResolvedValue([]);

      const result = await userService.getCoursesByUser(1);
      expect(result).toEqual({});
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile and return rows affected', async () => {
      db.fn = { now: jest.fn().mockReturnValue('2026-01-01') };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
      });

      const result = await userService.updateProfile(1, {
        FirstName: 'Jane',
        LastName: 'Doe',
        Bio: 'Speaker',
        Affiliation: 'MIT',
        ExpertiseID: 2,
        Role: 'Instructor',
      });
      expect(result).toBe(1);
    });

    it('should throw on DB error', async () => {
      db.fn = { now: jest.fn().mockReturnValue('2026-01-01') };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await expect(userService.updateProfile(1, {})).rejects.toThrow('DB error');
    });
  });
});
