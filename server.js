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
app.use('/inbox', require('./src/routes/inboxRoutes.js'));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler (keeps stack out of responses)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
