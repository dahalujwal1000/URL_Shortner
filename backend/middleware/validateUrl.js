const { isURL } = require('validator');

/**
 * Middleware to validate the URL in the request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateUrl(req, res, next) {
  const { originalUrl, customAlias } = req.body;

  // Check if originalUrl is provided
  if (!originalUrl) {
    return res.status(400).json({
      success: false,
      error: 'originalUrl is required',
    });
  }

  // Validate URL format
  if (!isURL(originalUrl, { 
    require_protocol: true, 
    require_valid_protocol: true,
    protocols: ['http', 'https'],
    reject_underscores: true,
  })) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid URL starting with http:// or https://',
    });
  }

  // Validate customAlias format if provided (alphanumeric, 3-20 chars)
  if (customAlias) {
    if (!/^[a-zA-Z0-9]{3,20}$/.test(customAlias)) {
      return res.status(400).json({
        success: false,
        error: 'Custom alias must be alphanumeric and between 3-20 characters',
      });
    }
  }

  // Check for expiration if provided
  if (req.body.expiresAt) {
    const expDate = new Date(req.body.expiresAt);
    if (isNaN(expDate.getTime()) || expDate <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'expiresAt must be a valid future date',
      });
    }
  }

  next();
}

module.exports = validateUrl;