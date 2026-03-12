const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const db = require('../../db/knex');

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await userService.getAllProfiles();
    res.json(profiles || []);
  } catch (e) {
    console.error('Error fetching profiles:', e);
    res.status(500).json({ error: 'An error occurred on profiles', details: e.message });
  }
};

exports.getProfileByID = async (req, res) => {
  try {
    const profile = await userService.getProfileByID(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpertise = async (req, res) => {
  try {
    const profile = await userService.getExpertise(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTrueInterests = async (req, res) => {
  try {
    const list = await userService.getTrueInterests(req.params.userID);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'An error occured on interests' });
  }
};

exports.getInterestsByUser = async (req, res) => {
  try {
    const data = await userService.getInterestsByUser(req.params.userID);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'An error occured on interests' });
  }
};

exports.getAllInterests = async (_req, res) => {
  try {
    const cols = await userService.getAllInterests();
    if (!cols?.length) return res.status(404).json({ message: 'No interests found.' });
    res.json(cols);
  } catch (e) {
    console.error('Error fetching interests:', e);
    res.status(500).json({ error: 'An error occurred fetching all interests.' });
  }
};

exports.getCoursesByUser = async (req, res) => {
  try {
    const courses = await userService.getCoursesByUser(req.params.userID);
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'An error occured on courses' });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const slots = await userService.getAvailability(req.params.userID);
    res.json(slots);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

exports.setAvailability = async (req, res) => {
  try {
    const { userID } = req.params;
    const { slots } = req.body;

    if (!Array.isArray(slots)) {
      return res.status(400).json({ error: 'slots must be an array' });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const slot of slots) {
      if (!validDays.includes(slot.DayOfWeek)) {
        return res.status(400).json({ error: `Invalid day: ${slot.DayOfWeek}` });
      }
      if (!slot.StartTime || !slot.EndTime) {
        return res.status(400).json({ error: 'StartTime and EndTime are required' });
      }
      if (slot.StartTime >= slot.EndTime) {
        return res.status(400).json({ error: 'StartTime must be before EndTime' });
      }
    }

    await userService.setAvailability(userID, slots);
    const updated = await userService.getAvailability(userID);
    res.json({ message: 'Availability updated successfully', availability: updated });
  } catch (err) {
    console.error('Error updating availability:', err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and current password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await userService.getProfileByID(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) return res.status(401).json({ error: 'Incorrect password' });

    const existing = await db('User').where({ Email: newEmail }).whereNot('ID', id).first();
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    await userService.updateEmail(id, newEmail);
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await userService.getProfileByID(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.Password);
    if (!ok) return res.status(401).json({ error: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(id, hashedPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;
    
    // Validate required fields
    if (!profileData.FirstName || !profileData.LastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }
    
    await userService.updateProfile(id, profileData);
    
    // Fetch and return updated profile
    const updatedProfile = await userService.getProfileByID(id);
    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
