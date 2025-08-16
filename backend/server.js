// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const PORT = Number(process.env.PORT || 5001);
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

const app = express();

// Core middleware
app.use(cors({ origin: ORIGIN, credentials: false })); // credentials false since we use bearer tokens
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.send('API running'));

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));       // ← add users route (for /api/users/me, etc.)
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Centralized error handler (so 500s are clear)
app.use((err, _req, res, _next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Bootstrap
(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Change PORT in .env or free it.`);
      } else {
        console.error('HTTP server error:', err);
      }
      process.exit(1);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();

// Last-resort crash logging
process.on('unhandledRejection', (e) => {
  console.error('Unhandled promise rejection:', e);
  process.exit(1);
});
