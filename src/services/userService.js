const db = require('../../db/knex');

exports.getAllProfiles = () => db('User').select('*');

exports.getInterestsByUser = (userID) =>
  db('Interests').where('userID', userID).first();

exports.getAllInterests = async () => {
  const all = await db('Interests');
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

exports.getAvailability = (userID) =>
  db('Availability').where('UserID', userID).orderByRaw("FIELD(DayOfWeek, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')");

exports.setAvailability = async (userID, slots) => {
  await db('Availability').where('UserID', userID).del();
  if (slots && slots.length > 0) {
    const rows = slots.map((slot) => ({
      UserID: userID,
      DayOfWeek: slot.DayOfWeek,
      StartTime: slot.StartTime,
      EndTime: slot.EndTime,
    }));
    await db('Availability').insert(rows);
  }
};

exports.updateEmail = async (id, newEmail) => {
  return db('User').where('ID', id).update({ Email: newEmail });
};

exports.updatePassword = async (id, hashedPassword) => {
  return db('User').where('ID', id).update({ Password: hashedPassword });
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

// Search functionality
exports.searchUsers = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = `%${query}%`;
  
  return db('User')
    .where('FirstName', 'like', searchTerm)
    .orWhere('LastName', 'like', searchTerm)
    .orWhere('Email', 'like', searchTerm)
    .orWhere('Affiliation', 'like', searchTerm)
    .select('ID', 'FirstName', 'LastName', 'Email', 'Bio', 'Affiliation', 'ExpertiseID', 'Role')
    .limit(20);
};