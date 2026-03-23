const eventService = require('../../src/services/eventService');
const db = require('../../db/knex');

jest.mock('../../db/knex', () => jest.fn());

describe('Event Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const events = [{ ID: 1, Topic: 'Test Talk' }];
      db.mockReturnValue({ select: jest.fn().mockResolvedValue(events) });

      const result = await eventService.getAllEvents();
      expect(result).toEqual(events);
      expect(db).toHaveBeenCalledWith('Event');
    });

    it('should return empty array when no events exist', async () => {
      db.mockReturnValue({ select: jest.fn().mockResolvedValue([]) });

      const result = await eventService.getAllEvents();
      expect(result).toEqual([]);
    });
  });

  describe('getEventsByUser', () => {
    it('should return events for a given user', async () => {
      const events = [{ ID: 1, RequesterID: 5 }];
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockResolvedValue(events),
      });

      const result = await eventService.getEventsByUser(5);
      expect(result).toEqual(events);
    });

    it('should return empty array when user has no events', async () => {
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockResolvedValue([]),
      });

      const result = await eventService.getEventsByUser(99);
      expect(result).toEqual([]);
    });
  });

  describe('getEventByID', () => {
    it('should return the event with requester and instructor names', async () => {
      const event = { ID: 1, Topic: 'Talk', RequesterName: 'Jane Doe', InstructorName: 'John Smith' };
      const mockChain = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(event),
      };
      db.mockReturnValue(mockChain);
      db.raw = jest.fn().mockReturnValue('raw_sql');

      const result = await eventService.getEventByID(1);
      expect(result).toEqual(event);
    });

    it('should return undefined when event is not found', async () => {
      const mockChain = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      };
      db.mockReturnValue(mockChain);
      db.raw = jest.fn().mockReturnValue('raw_sql');

      const result = await eventService.getEventByID(999);
      expect(result).toBeUndefined();
    });
  });

  describe('searchEvents', () => {
    it('should return matching events for a search term', async () => {
      const events = [{ ID: 1, Topic: 'Machine Learning' }];
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(events),
      });

      const result = await eventService.searchEvents('Machine');
      expect(result).toEqual(events);
    });

    it('should return empty array when no events match', async () => {
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      });

      const result = await eventService.searchEvents('xyz-no-match');
      expect(result).toEqual([]);
    });
  });

  describe('requestSpeaker', () => {
    it('should insert a new event and return its ID', async () => {
      db.mockReturnValue({ insert: jest.fn().mockResolvedValue([99]) });

      const payload = {
        RequesterID: 1,
        Topic: 'Intro to AI',
        Description: 'A great talk',
        Date: '2026-04-01',
        EventStatus: 'Pending',
        ExpertiseID: 2,
        DeliveryMethod: 'In-person',
      };

      const eventID = await eventService.requestSpeaker(payload);
      expect(eventID).toBe(99);
    });

    it('should throw on DB error', async () => {
      db.mockReturnValue({ insert: jest.fn().mockRejectedValue(new Error('DB error')) });

      await expect(eventService.requestSpeaker({})).rejects.toThrow('DB error');
    });
  });

  describe('recommendedEvents', () => {
    it('should return events matching user interests and courses', async () => {
      const events = [{ ID: 10, course: 'intro_cs', status: 'Pending' }];

      db.mockImplementation((table) => {
        if (table === 'interests') {
          return {
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ userID: 1, computer_science: 1 }),
          };
        }
        if (table === 'courses_computer_science') {
          return {
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ userID: 1, intro_cs: 1 }),
          };
        }
        if (table === 'events') {
          return {
            whereIn: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            andWhereNot: jest.fn().mockResolvedValue(events),
          };
        }
      });

      const result = await eventService.recommendedEvents(1);
      expect(result).toEqual(events);
    });

    it('should return events query result when user has no interests', async () => {
      db.mockImplementation((table) => {
        if (table === 'interests') {
          return {
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(null),
          };
        }
        if (table === 'events') {
          return {
            whereIn: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            andWhereNot: jest.fn().mockResolvedValue([]),
          };
        }
      });

      const result = await eventService.recommendedEvents(1);
      expect(result).toEqual([]);
    });
  });

  describe('getCourseColumnsForField', () => {
    it('should return course column names for a valid field', async () => {
      db.raw = jest.fn().mockResolvedValue([
        [{ Field: 'userID' }, { Field: 'intro_cs' }, { Field: 'data_structures' }],
      ]);

      const result = await eventService.getCourseColumnsForField('Computer Science');
      expect(result).toEqual(['intro_cs', 'data_structures']);
    });

    it('should return null for an invalid field', async () => {
      const result = await eventService.getCourseColumnsForField('Invalid Field');
      expect(result).toBeNull();
    });
  });
});
