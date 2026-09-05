/**
 * URL Shortener API Service
 * Handles all API communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Shortens a URL
 * @param {string} originalUrl - The long URL to shorten
 * @param {string|null} customAlias - Optional custom alias
 * @param {string|null} expiresAt - Optional expiration date
 * @returns {Promise<Object>} Response with short URL data
 */
export async function shortenUrl(originalUrl, customAlias = null, expiresAt = null) {
  const payload = { originalUrl };
  if (customAlias) payload.customAlias = customAlias;
  if (expiresAt) payload.expiresAt = expiresAt;

  const response = await fetch(`${API_BASE_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to shorten URL');
  }

  return response.json();
}

/**
 * Gets details of a shortened URL
 * @param {string} shortCode - The short code to look up
 * @returns {Promise<Object>} URL details
 */
export async function getUrlDetails(shortCode) {
  const response = await fetch(`${API_BASE_URL}/url/${shortCode}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'URL not found');
  }

  return response.json();
}

/**
 * Gets analytics for a shortened URL
 * @param {string} shortCode - The short code to get analytics for
 * @returns {Promise<Object>} Analytics data
 */
export async function getAnalytics(shortCode) {
  const response = await fetch(`${API_BASE_URL}/analytics/${shortCode}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analytics not found');
  }

  return response.json();
}

/**
 * Deactivates a shortened URL
 * @param {string} shortCode - The short code to deactivate
 * @returns {Promise<Object>} Response message
 */
export async function deactivateUrl(shortCode) {
  const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to deactivate URL');
  }

  return response.json();
}
