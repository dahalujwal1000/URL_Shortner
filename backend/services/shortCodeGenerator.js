// Generate a short code from a numeric ID using base62 encoding
const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARSET.length; // 62

/**
 * Encodes a number to a base62 string
 * @param {number} num - The number to encode
 * @returns {string} The base62 encoded string
 */
function encodeBase62(num) {
  if (num === 0) return CHARSET[0];
  let str = '';
  let n = num;
  while (n > 0) {
    str = CHARSET[n % BASE] + str;
    n = Math.floor(n / BASE);
  }
  return str;
}

/**
 * Decodes a base62 string to a number
 * @param {string} str - The base62 string to decode
 * @returns {number} The decoded number
 */
function decodeBase62(str) {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * BASE + CHARSET.indexOf(str[i]);
  }
  return num;
}

/**
 * Generates a random alphanumeric string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a unique short code
 * Uses base62 encoding of the next available ID for sequential short codes.
 * If the ID is provided, encode it. Otherwise, generate a random string.
 * @param {number|null} id - The ID to encode (optional)
 * @param {number} minLength - Minimum length of the short code
 * @returns {string} Unique short code
 */
function generateShortCode(id = null, minLength = 6) {
  if (id !== null) {
    let code = encodeBase62(id);
    // Pad with '0' characters if needed to meet minimum length
    while (code.length < minLength) {
      code = '0' + code;
    }
    return code;
  }
  // Fallback: random string
  return generateRandomString(8);
}

module.exports = {
  encodeBase62,
  decodeBase62,
  generateRandomString,
  generateShortCode,
};