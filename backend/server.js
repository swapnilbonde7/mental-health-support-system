const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// simple health
app.get('/api/health', (_req, res) => res.send('API running'));

// routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// error handler LAST
app.use((err, req, res, _next) => {
  const code = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(code).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
