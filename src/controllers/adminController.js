const adminService = require('../services/adminService');

exports.updateEventStatus = async (req, res) => {
  const { eventID } = req.params;
  const updateData = req.body;
  try {
    await adminService.updateEvent(eventID, updateData);
    res.json({ message: 'Event updated successfully' });
  } catch (e) {
    console.error('Error updating event:', e);
    res.status(500).json({ error: 'Error updating event' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userID } = req.params;
  try {
    await adminService.deleteUserCascade(userID);
    res.json({ message: 'User deleted successfully' });
  } catch (e) {
    console.error('Error deleting user:', e);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

exports.getAdmin = async (req, res) => {
  const { adminID } = req.params;
  try {
    const admin = await adminService.getAdmin(adminID);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    delete admin.password;
    res.json(admin);
  } catch (e) {
    console.error('Error fetching admin details:', e);
    res.status(500).json({ error: 'Error fetching admin details' });
  }
};
