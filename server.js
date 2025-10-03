require('dotenv').config();
const express = require('express');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const db = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
});

app.use(express.json());
app.use(cors());

// Use auth routes
const authRoutes = require('./routes/auth')(db);
app.use('/api/auth', authRoutes);

// Use admin auth routes
const adminAuthRoutes = require('./routes/adminAuth')(db);
app.use('/api/auth', adminAuthRoutes);

// Register route
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, affiliation, interests, expertise, history } = req.body;

  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const count = await db('users').where('email', email).count('* as count');
  if (count[0].count > 0) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [userID] = await db('users').insert({
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await db('profile').insert({
      userID,
      name: `${firstName} ${lastName}`,
      interests,
      expertise,
      history,
      affiliation,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await db('interests').insert({
      userID
    });

    res.status(201).json({ message: 'User registered successfully', userID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//get all users in database
app.get('/users', async (req, res) => {
    try {
      const users = await db('users').select('*');
      res.json(users);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'An error occured on users' });
    }
  });

//get events for users
app.get('/events/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const events = await db('events').where('instructorID', userID).orWhere('requesterID', userID).select('*');
    res.json(events)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'An error occured on events'});
  }
});

//get recommended events
app.get('/recommendedEvents/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const userInterests = await db('interests').where('userID', userID).first();
    const trueInterests = [];
    const trueCourses = [];

    if (userInterests) {
    
      for (const key in userInterests) {
        if (userInterests.hasOwnProperty(key) && userInterests[key] === 1 && key !== 'userID') {
          // Check if the property belongs to the object and if the value is true
          trueInterests.push(key);
        }
      }
    
    } else {
        console.log("no interests found for that user");
    }

    if (trueInterests) {
      for (const interest of trueInterests) {
        const adjustedKey = interest.toLowerCase().replace(/ /g, '_');
        const courses = await db('courses_' + adjustedKey).where('userID', userID).first();
        for (const key in courses) {
          if (courses.hasOwnProperty(key) && courses[key] === 1 && key !== 'userID') {
            trueCourses.push(key);
          }
        }
        
      }

      console.log(trueCourses);
    } else {
      console.log("no courses found");
    }

    const recEvents = await db('events').whereIn('course', trueCourses).andWhere('status', 'Pending').andWhereNot('requesterID', userID);
    res.json(recEvents);
  
  } catch (error) {
    res.status(500).json({error: 'An error occured on recEvents'})
  }
});

  //get all profiles in database
  app.get('/profiles', async (req, res) => {
    try {
      console.log('Attempting to fetch profiles from database');
      // Test database connection
      try {
        const testConnection = await db.raw('SELECT 1+1 AS result');
        console.log('Database connection successful');
      } catch (error) {
        console.error('Database connection test failed:', error);
        return res.status(500).json({ error: 'Database connection failed' });
      }
      
      const users = await db('profile').select('*');
      console.log(`Profiles retrieved: ${users?.length || 0}`);
      res.json(users || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ error: 'An error occurred on profiles', details: error.message });
    }
  });

//get all profiles in database
app.get('/profiles', async (req, res) => {
  try {
    const users = await db('profile').select('*');
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on profiles' });
  }
});

//get all events in database
app.get('/events', async (req, res) => {
  try {
    const events = await db('events').select('*');
    res.json(events);
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on events' });
  }
})

//get user true interests
app.get('/trueInterests/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const userInterests = await db('interests').where('userID', userID).first();
    const trueInterests = [];

    if (userInterests) {
    
      for (const key in userInterests) {
        if (userInterests.hasOwnProperty(key) && userInterests[key] == 1  && key != 'userID') {
          // Check if the property belongs to the object and if the value is true
          trueInterests.push(key);
        }
      }
    
    } else {
        console.log("no interests found for that user");
    }

    res.json(trueInterests);
  
  } catch (error) {
    res.status(500).json({error: 'An error occured on interests'})
  }
});

//get user interests
app.get('/interests/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const userInterests = await db('interests').where('userID', userID).first();
    res.json(userInterests);
  } catch (error) {
    res.status(500).json({error: 'An error occured on interests'})
  }
});

// get all interests
app.get('/allInterests', async (req, res) => {
  try {
    const interests = await db('interests');

    if (!interests || interests.length === 0) {
      return res.status(404).json({ message: 'No interests found.' }); 
    }
    
    const columnNames = Object.keys(interests[0]);
    res.json(columnNames);
   
  } catch (error) {
    console.error('Error fetching interests:', error); 
    res.status(500).json({ error: 'An error occurred fetching all interests.' });
  }
});

//get user courses
app.get('/courses/:userID', async (req, res) => {
  const { userID } = req.params;
  
  try {
    const courses = {};
    const userInterests = await db('interests').where('userID', userID).first();
    
    for (const key in userInterests) {
      adjustedKey = key.toLowerCase().replace(/ /g, '_');
      
      if (userInterests[key] === 1 && key != 'userID') {
        courses[key] = await db('courses_' + adjustedKey).where('userID', userID).first();
      }
    }
    
    // const temp = await db('courses_' + adjustedKey).where('userID', userID).first();
    // for (const i in temp) {
    //   if (i != 'userID') {
    //     courses[i] = temp[i];
    //   }

    res.json(courses);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on courses' });
  }
});

//get courses for a field
app.get('/filteredCourses/:field', async (req, res) => {
  const { field } = req.params;
  
  try {
    const courses = await db('courses_' + field).select('*').first();
    res.json(courses);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on courses' });
  }
});


//update user interests
app.put('/interests/:userID', async (req, res) => {
  const { userID } = req.params;
  const interests = req.body;

  try {
    const updateData = {};
    for (const key in interests) {
      if (key !== 'userID') { // Skip the userID field
        updateData[key] = interests[key]; 
        adjustedKey = key.toLowerCase().replace(/ /g, '_');
      
        if (interests[key] === 1) {
          await db('courses_' + adjustedKey).insert({userID: userID}).onConflict('userID').merge()
          }
          else if (interests[key] === 0) {
            await db('courses_' + adjustedKey).where('userID', userID).delete()
          }
      }
    }

    await db('interests').where('userID', userID).update(updateData);
    res.json({ message: 'Interests updated successfully' });
  } catch (error) {
    console.error('Error updating interests:', error);
    res.status(500).json({ error: 'An error occurred on interests' });
  }
});

//update user courses
app.put('/courses/:userID', async (req, res) => {
  const { userID } = req.params;
  const interests = req.body;
  
  try {
    const updateData = {};
    for (const key in interests) {
      updateData[key] = interests[key]; 
      if (key !== 'userID') { // Skip the userID field
        adjustedKey = key.toLowerCase().replace(/ /g, '_');
        await db('courses_' + adjustedKey).where('userID', userID).update(updateData[key])
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on courses' });
  }
});

// get profile
app.get('/profile/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
      const profile = await db('profile').where('userID', userID).select('*');
      res.json(profile);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'An error occured on profile' });
    }
  });

// update profile
app.put('/profile/:userID', async (req, res) => {
  const { userID } = req.params;
  const { name, interests, affiliation, expertise, history } = req.body;
  try {
    await db('profile').where('userID', userID).update({ name, interests, affiliation, expertise, history });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on profile update' });
  }
});

// get event
app.get('/event/:eventID', async (req, res) => {
  const { eventID } = req.params;
  try {
    const event = await db('events').where('eventID', eventID).select('*');
    res.json(event);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on event' });
  }
});

// search by topic
app.get('/search/topic/:topic', async (req, res) => {
  const { topic } = req.params;
  try {
    const events = await db('events').where('topic', 'like', `%${topic}%`).select('*');
    res.json(events);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on search by topic' });
  }
});


// search by field
app.get('/search/field/:field', async (req, res) => {
  const { field } = req.params;
  try {
    const events = await db('events').where('field', 'like', `%${field}%`).select('*');
    res.json(events);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occured on search by field' });
  }
});

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

app.get('/event-call-courses/:field', async (req, res) => {
  const field = req.params.field;
  const tableName = fieldToTableMap[field];

  if (!tableName) {
    return res.status(400).json({ error: 'Invalid field' });
  }

  try {
    const columns = await db.raw(`SHOW COLUMNS FROM ${tableName}`);
    const courseColumns = columns[0]
      .map(col => col.Field)
      .filter(col => col !== 'userID');

    res.json(courseColumns);
  } catch (err) {
    console.error('Course fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Request Speaker Route
app.post('/request-speaker', async (req, res) => {
  const { eventID, instructorID, topic, description, field, date, deliveryMethod, status, requesterID, affiliation, course } = req.body;

  try {
    // Insert request data into the database
    const [requestID] = await db('events').insert({
      requesterID,
      topic,
      description,
      field,
      deliveryMethod,
      status,
      date,
      affiliation,
      created_at: new Date(),
      updated_at: new Date(),
      course,
    });

    res.status(201).json({ message: 'Speaker request submitted successfully', requestID });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'An error occurred while submitting your request.' });
  }
});


// Admin Routes with protection
const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    if (!decoded.admin) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }
    
    // Find admin
    const admin = await db('admin').where('adminID', decoded.admin.id).first();
    
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    
    req.admin = decoded.admin;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin route to update event status
app.put('/admin/events/:eventID', adminAuthMiddleware, async (req, res) => {
  const { eventID } = req.params;
  const updateData = req.body;
  
  try {
    await db('events').where('eventID', eventID).update({
      ...updateData,
      updated_at: new Date()
    });
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Admin route to delete user
app.delete('/admin/users/:userID', adminAuthMiddleware, async (req, res) => {
  const { userID } = req.params;
  
  try {
    // In a real application, you might want to implement cascade deletion
    // or handle foreign key constraints properly
    await db('interests').where('userID', userID).delete();
    await db('profile').where('userID', userID).delete();
    await db('users').where('userID', userID).delete();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
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
  console.log(`Server is running on port ${PORT}`);
});