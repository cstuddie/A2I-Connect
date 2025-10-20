const db = require('../../db/knex'); 

exports.getAllUsers = async () => {
  return await db('users').select('*');
};