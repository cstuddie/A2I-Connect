require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('API running'));

// Routers
app.use('/api/auth', require('./src/routes/authRoutes.js'));
app.use('/admin',     require('./src/routes/adminRoutes.js'));
app.use('/users',     require('./src/routes/userRoutes.js'));
app.use('/events',    require('./src/routes/eventRoutes.js'));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler (keeps stack out of responses)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Admin route to delete user
app.delete('/admin/users/:userID', adminAuthMiddleware, async (req, res) => {
  const { userID } = req.params;
  
  try {
    await db('interests').where('userID', userID).delete();
    await db('profile').where('userID', userID).delete();
    await db('users').where('userID', userID).delete();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Admin route to delete event
app.delete('/admin/events/:eventID', adminAuthMiddleware, async (req, res) => {
  const { eventID } = req.params;
  
  try {
    await db('events').where('eventID', eventID).delete();
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Get admin details
app.get('/admin/:adminID', adminAuthMiddleware, async (req, res) => {
  const { adminID } = req.params;
  
  try {
    const admin = await db('admin').where('adminID', adminID).first();
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Remove sensitive information
    delete admin.password;
    
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ error: 'Error fetching admin details' });
  }
});

// Add courses from interests selection
// app.post('/addCourses/:userID/:interest', async (req, res) => {
//   const { userID, interest } = req.params;
//   try {
//     if (interest === '') {
//       await db('interests').where('userID', userID).update({ interest });
//     } else {
//       await db('interests').where('userID', userID).update({ interest });
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'An error occured on addCourses' });
//   }
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
