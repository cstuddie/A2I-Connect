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

exports.recommendedEvents = async (userID) => {
  // mirrors the logic from server.js [L1–L37]
  const trueInterests = [];
  const trueCourses = [];

  const interestsRow = await db('interests').where('userID', userID).first();
  if (interestsRow) {
    for (const key in interestsRow) {
      if (Object.prototype.hasOwnProperty.call(interestsRow, key) && interestsRow[key] === 1 && key !== 'userID') {
        trueInterests.push(key);
      }
    }
  }

  for (const interest of trueInterests) {
    const adjusted = interest.toLowerCase().replace(/ /g, '_');
    const courses = await db('courses_' + adjusted).where('userID', userID).first();
    if (courses) {
      for (const key in courses) {
        if (Object.prototype.hasOwnProperty.call(courses, key) && courses[key] === 1 && key !== 'userID') {
          trueCourses.push(key);
        }
      }
    }
  }

  return db('events')
    .whereIn('course', trueCourses)
    .andWhere('status', 'Pending')
    .andWhereNot('requesterID', userID);
};
