const express = require('express');
const router = express.Router();
const { createShortUrl, getUrlDetails, getAnalytics, deactivateUrlController } = require('../controllers/urlController');
const validateUrl = require('../middleware/validateUrl');

// Create a short URL
router.post('/shorten', validateUrl, createShortUrl);

// Get URL details
router.get('/url/:shortCode', getUrlDetails);

// Get analytics for a URL
router.get('/analytics/:shortCode', getAnalytics);

// Deactivate a URL
router.delete('/url/:shortCode', deactivateUrlController);

module.exports = router;