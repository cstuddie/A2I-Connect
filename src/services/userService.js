const db = require('../../db/knex');

exports.getAllProfiles = () => db('user').select('*');

exports.getInterestsByUser = (userID) =>
  db('interests').where('userID', userID).first();

exports.getAllInterests = async () => {
  const all = await db('interests');
  if (!all || !all.length) return [];
  return Object.keys(all[0]);
};

exports.getExpertise = () => db('Expertise').select('*');

exports.getProfileByID = (id) => db('User').where('ID', id).first();

exports.getTrueInterests = async (userID) => {
  const userInterests = await db('interests').where('userID', userID).first();
  const trueInterests = [];
  if (!userInterests) return trueInterests;
  for (const key in userInterests) {
    if (Object.prototype.hasOwnProperty.call(userInterests, key) && userInterests[key] == 1 && key !== 'userID') {
      trueInterests.push(key);
    }
  }
  return trueInterests;
};

exports.getCoursesByUser = async (userID) => {
  const result = {};
  const interests = await this.getTrueInterests(userID);
  for (const interest of interests) {
    const adjusted = interest.toLowerCase().replace(/ /g, '_');
    const row = await db('courses_' + adjusted).where('userID', userID).first();
    if (!row) continue;
    for (const key in row) {
      if (key !== 'userID' && row[key] === 1) result[key] = true;
    }
  }
  return result;
};

exports.updateProfile = async (id, profileData) => {
  const { FirstName, LastName, Bio, Affiliation, ExpertiseID, Role } = profileData;
  
  return db('User')
    .where('ID', id)
    .update({
      FirstName,
      LastName,
      Bio,
      Affiliation,
      ExpertiseID,
      Role,
      updated_at: db.fn.now()
    });
};