const { insertUrl, getUrlByShortCode, incrementClickCount, getUrlAnalytics, getNextId, deactivateUrl } = require('../models/urlModel');
const { generateShortCode } = require('../services/shortCodeGenerator');

const VALID_PROTOCOLS = ['http:', 'https:'];

/**
 * POST /api/shorten
 * Creates a short URL from a long URL
 */
async function createShortUrl(req, res) {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    
    // Check if customAlias is already taken
    if (customAlias) {
      const existing = await getUrlByShortCode(customAlias, customAlias);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'This custom alias is already taken. Please choose another.',
        });
      }
    }
    
    // Generate short code
    let shortCode;
    if (customAlias) {
      shortCode = customAlias;
    } else {
      // Get next ID for sequential base62 short code
      const nextId = await getNextId();
      shortCode = generateShortCode(nextId, 6);
    }
    
    // Insert into database
    const newUrl = await insertUrl({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      expiresAt: expiresAt || null,
    });
    
    // Build the full short URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = customAlias 
      ? `${baseUrl}/${customAlias}` 
      : `${baseUrl}/${shortCode}`;
    
    res.status(201).json({
      success: true,
      data: {
        originalUrl: newUrl.originalUrl,
        shortUrl,
        shortCode: newUrl.shortCode,
        customAlias: newUrl.customAlias,
        createdAt: newUrl.createdAt,
        expiresAt: newUrl.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create short URL',
    });
  }
}

/**
 * GET /api/url/:shortCode
 * Retrieves details of a shortened URL
 */
async function getUrlDetails(req, res) {
  try {
    const { shortCode } = req.params;
    const url = await getUrlByShortCode(shortCode);
    
    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found',
      });
    }
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = url.custom_alias 
      ? `${baseUrl}/${url.custom_alias}` 
      : `${baseUrl}/${url.short_code}`;
    
    res.json({
      success: true,
      data: {
        id: url.id,
        originalUrl: url.original_url,
        shortUrl,
        shortCode: url.short_code,
        customAlias: url.custom_alias,
        clickCount: url.click_count,
        isActive: url.is_active,
        createdAt: url.created_at,
        expiresAt: url.expires_at,
      },
    });
  } catch (error) {
    console.error('Error fetching URL details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch URL details',
    });
  }
}

/**
 * GET /api/analytics/:shortCode
 * Retrieves analytics for a shortened URL
 */
async function getAnalytics(req, res) {
  try {
    const { shortCode } = req.params;
    const analytics = await getUrlAnalytics(shortCode);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        error: 'URL not found or has no analytics',
      });
    }
    
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
}

/**
 * DELETE /api/url/:shortCode
 * Deactivates a shortened URL
 */
async function deactivateUrlController(req, res) {
  try {
    const { shortCode } = req.params;
    const success = await deactivateUrl(shortCode);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found',
      });
    }
    
    res.json({
      success: true,
      message: 'URL has been deactivated',
    });
  } catch (error) {
    console.error('Error deactivating URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate URL',
    });
  }
}

module.exports = {
  createShortUrl,
  getUrlDetails,
  getAnalytics,
  deactivateUrlController,
};