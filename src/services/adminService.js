const db = require('../../db/knex');

exports.updateEvent = (eventID, updateData) =>
  db('Event').where('ID', eventID).update({ ...updateData, updated_at: new Date() });

exports.deleteUserCascade = async (userID) => {
  await db('UserInterests').where('UserID', userID).del();
  await db('User').where('ID', userID).del();
};

exports.getAdmin = (adminID) =>
  db('User').where({ ID: adminID, IsAdmin: true }).first();

exports.setEmailToBanned = (email) =>
  db('Banned').insert({ Email: email });
