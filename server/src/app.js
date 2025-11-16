// Express App Configuration
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors'); // Handle async errors automatically

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tasks', taskRoutes);

// Handle 404 errors
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
