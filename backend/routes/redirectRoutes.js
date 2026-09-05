const express = require('express');
const router = express.Router();
const { getUrlByShortCode, incrementClickCount } = require('../models/urlModel');

/**
 * GET /:shortCode
 * Redirects a short URL to its original URL
 * Also handles custom aliases
 */
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await getUrlByShortCode(shortCode, shortCode);
    
    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found',
      });
    }
    
    // Check if URL is active
    if (!url.is_active) {
      return res.status(410).json({
        success: false,
        error: 'This URL has been deactivated',
      });
    }
    
    // Check if URL has expired
    if (url.expires_at && new Date(url.expires_at) <= new Date()) {
      return res.status(410).json({
        success: false,
        error: 'This URL has expired',
      });
    }
    
    // Increment click count and log the click
    await incrementClickCount(url.id, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
    });
    
    // Redirect to original URL
    res.redirect(302, url.original_url);
  } catch (error) {
    console.error('Error during redirect:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

module.exports = router;