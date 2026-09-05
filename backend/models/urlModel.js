const db = require('../config/database');

/**
 * Inserts a new URL entry into the database
 * @param {Object} urlData - Object containing originalUrl, shortCode, customAlias, expiresAt
 * @returns {Promise<Object>} - Resolves with the inserted URL data
 */
function insertUrl(urlData) {
  return new Promise((resolve, reject) => {
    const { originalUrl, shortCode, customAlias = null, expiresAt = null } = urlData;
    const query = `
      INSERT INTO urls (original_url, short_code, custom_alias, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [originalUrl, shortCode, customAlias, expiresAt], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          originalUrl,
          shortCode,
          customAlias,
          expiresAt,
        });
      }
    });
  });
}

/**
 * Retrieves a URL record by short code (and optionally custom alias)
 * @param {string} shortCode - The short code to look up
 * @param {string|null} customAlias - Optional custom alias to check first
 * @returns {Promise<Object|null>} - Resolves with URL record or null
 */
function getUrlByShortCode(shortCode, customAlias = null) {
  return new Promise((resolve, reject) => {
    const query = customAlias
      ? `SELECT * FROM urls WHERE custom_alias = ? OR short_code = ?`
      : `SELECT * FROM urls WHERE short_code = ?`;
    
    const params = customAlias ? [customAlias, shortCode] : [shortCode];
    
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Increments the click count for a URL and logs the click
 * @param {number} urlId - The ID of the URL that was clicked
 * @param {Object} clickData - Click metadata (ip, userAgent, referrer)
 * @returns {Promise<void>}
 */
function incrementClickCount(urlId, clickData = {}) {
  return new Promise((resolve, reject) => {
    const { ipAddress = null, userAgent = null, referrer = null } = clickData;
    
    // Increment click count
    db.run(
      `UPDATE urls SET click_count = click_count + 1 WHERE id = ?`,
      [urlId],
      (err) => {
        if (err) return reject(err);
        
        // Log the click
        const insertQuery = `
          INSERT INTO url_clicks (url_id, ip_address, user_agent, referrer)
          VALUES (?, ?, ?, ?)
        `;
        db.run(insertQuery, [urlId, ipAddress, userAgent, referrer], (err) => {
          if (err) return reject(err);
          resolve();
        });
      }
    );
  });
}

/**
 * Gets analytics/click data for a specific URL
 * @param {string} shortCode - The short code of the URL
 * @returns {Promise<Object>} - Resolves with analytics data
 */
function getUrlAnalytics(shortCode) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.*,
        COUNT(c.id) as total_clicks
      FROM urls u
      LEFT JOIN url_clicks c ON u.id = c.url_id
      WHERE u.short_code = ?
      GROUP BY u.id
    `;
    
    db.get(query, [shortCode], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      // Get click details
      db.all(
        `SELECT * FROM url_clicks WHERE url_id = ? ORDER BY clicked_at DESC LIMIT 100`,
        [row.id],
        (err, clicks) => {
          if (err) return reject(err);
          
          resolve({
            id: row.id,
            originalUrl: row.original_url,
            shortCode: row.short_code,
            customAlias: row.custom_alias,
            createdAt: row.created_at,
            clickCount: row.total_clicks,
            isActive: row.is_active,
            expiresAt: row.expires_at,
            recentClicks: clicks,
          });
        }
      );
    });
  });
}

/**
 * Gets the next available ID (for sequential short code generation)
 * @returns {Promise<number>}
 */
function getNextId() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT MAX(id) + 1 as nextId FROM urls`, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.nextId || 1);
    });
  });
}

/**
 * Updates a URL record (e.g., deactivation, expiration)
 * @param {number} id - URL record ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
function updateUrl(id, updates) {
  return new Promise((resolve, reject) => {
    const setParts = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);
    
    db.run(
      `UPDATE urls SET ${setParts} WHERE id = ?`,
      [...values, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

/**
 * Deactivates (deletes) a URL by short code
 * @param {string} shortCode - The short code
 * @returns {Promise<boolean>} - True if a row was deleted
 */
function deactivateUrl(shortCode) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE urls SET is_active = 0 WHERE short_code = ?`,
      [shortCode],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

module.exports = {
  insertUrl,
  getUrlByShortCode,
  incrementClickCount,
  getUrlAnalytics,
  getNextId,
  updateUrl,
  deactivateUrl,
};