const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for request logging
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'requests.log'),
  { flags: 'a' }
);

// Morgan format for logging
const logFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : 'dev';

// Export morgan middleware
const requestLogger = morgan(logFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Don't log health checks in production
    if (process.env.NODE_ENV === 'production' && req.url === '/health') {
      return true;
    }
    return false;
  },
});

// Custom logger for application events
const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`);
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
    if (error) console.error(error);
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`);
  },
};

module.exports = {
  requestLogger,
  logger,
};