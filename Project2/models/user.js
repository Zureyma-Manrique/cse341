// models/user.js
// Canonical shape for the "users" collection. Since authentication is
// handled entirely by Google OAuth, we never store a password — only
// the profile info Google gives us plus our own bookkeeping fields.

/**
 * @typedef {Object} User
 * @property {string} googleId     - Stable unique id from Google's profile
 * @property {string} displayName
 * @property {string} email
 * @property {string} avatarUrl
 * @property {Date}   createdAt
 * @property {Date}   lastLoginAt
 */

/**
 * @param {Partial<User>} data
 * @returns {User}
 */
function buildUser(data = {}) {
  const now = new Date();
  return {
    googleId: data.googleId,
    displayName: data.displayName || 'Unknown User',
    email: data.email || null,
    avatarUrl: data.avatarUrl || null,
    createdAt: data.createdAt || now,
    lastLoginAt: now,
  };
}

module.exports = { buildUser };
