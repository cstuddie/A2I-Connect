const db = require('../../db/knex');

const fieldToTableMap = {
  'Computer Science': 'courses_computer_science',
  'Mathematics': 'courses_mathematics',
  'Physics': 'courses_physics',
  'Chemistry': 'courses_chemistry',
  'Biology': 'courses_biology',
  'Psychology': 'courses_psychology',
  'Architecture': 'courses_architecture',
  'Art': 'courses_art',
  'Aerospace Engineering': 'courses_aerospace_engineering',
  'Biomedical Engineering': 'courses_biomedical_engineering',
  'Data Science': 'courses_data_science',
  'Environmental Engineering': 'courses_environmental_engineering',
};

exports.getAllEvents = () => db('Event').select('*');

exports.getCourseColumnsForField = async (field) => {
  const tableName = fieldToTableMap[field];
  if (!tableName) return null;
  const columns = await db.raw(`SHOW COLUMNS FROM ${tableName}`);
  return columns[0].map(c => c.Field).filter(c => c !== 'userID');
};

exports.getEventsByUser = async (userID) => {
  return db('Event').where('RequesterID', userID).orWhere('InstructorID', userID);
};

exports.getEventByID = async (eventID) => {
  return db('Event as e')
    .leftJoin('User as r', 'e.RequesterID', 'r.ID')
    .leftJoin('User as i', 'e.InstructorID', 'i.ID')
    .select(
      'e.*',
      db.raw("CONCAT(r.FirstName, ' ', r.LastName) as RequesterName"),
      db.raw("CONCAT(i.FirstName, ' ', i.LastName) as InstructorName")
    )
    .where('e.ID', eventID)
    .first();
};

exports.searchEvents = async (term) => {
  return db('Event')
    .where('Topic', 'like', `%${term}%`)
    .select('*');
};

exports.requestSpeaker = async (payload) => {
  const { RequesterID, Topic, Description, Date: EventDate, EventStatus, ExpertiseID, DeliveryMethod } = payload;
  
  const [eventID] = await db('Event').insert({
    RequesterID,
    Topic,
    Description,
    Date: EventDate,
    EventStatus,
    ExpertiseID,
    DeliveryMethod,
    created_at: new Date(),
    updated_at: new Date()
  });
  
  return eventID;
};

exports.acceptEvent = async ({ eventID, speakerID }) => {
  const event = await db('Event').where('ID', eventID).first();
  if (!event) throw new Error('Event not found');
  if (event.InstructorID) throw new Error('Event already accepted');

  await db('Event').where('ID', eventID).update({
    InstructorID: speakerID,
    EventStatus: 2,
    updated_at: new Date()
  });

  const inboxService = require('./inboxService');
  const conversation = await inboxService.createConversation({
    initiatorID: speakerID,
    receiverID: event.RequesterID,
    associatedEventID: eventID
  });

  await inboxService.sendMessage({
    Content: `I've accepted the speaking request for: ${event.Topic}.`,
    SenderID: speakerID,
    ConversationID: conversation.ID
  });

  return { eventID, conversationID: conversation.ID };
};

exports.recommendedEvents = async (userID) => {
  const interests = await db('UserInterests')
    .where('UserID', userID)
    .select('InterestID');

  if (interests.length === 0) return [];

  const interestIDs = interests.map(i => i.InterestID);

  return db('Event')
    .whereIn('ExpertiseID', interestIDs)
    .where('EventStatus', 1)
    .whereNull('InstructorID')
    .whereNot('RequesterID', userID)
    .select('*');
};
