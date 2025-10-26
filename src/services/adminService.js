const db = require('../../db/knex');

exports.updateEvent = (eventID, updateData) =>
  db('events').where('eventID', eventID).update({ ...updateData, updated_at: new Date() });

exports.deleteUserCascade = async (userID) => {
  await db('interests').where('userID', userID).del();
  await db('profile').where('userID', userID).del();
  await db('users').where('userID', userID).del();
};

exports.getAdmin = (adminID) =>
  db('admin').where('adminID', adminID).first();
