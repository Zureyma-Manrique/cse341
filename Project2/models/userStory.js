// models/userStory.js
// The native MongoDB driver is schema-less, so this module documents the
// canonical shape of a "userStories" document and provides a factory
// function that normalizes/defaults fields before insertion.

/**
 * @typedef {Object} UserStory
 * @property {string} title
 * @property {string} description
 * @property {string} promptSource      - The raw natural-language prompt that generated this story
 * @property {string} status            - "pending" | "approved" | "rejected" | "synced"
 * @property {number} estimatedHours
 * @property {Date}   scheduledDate
 * @property {string} googleEventId     - Populated once synced to Google Calendar
 * @property {boolean} isSynced
 * @property {string} projectName
 * @property {Date}   createdAt
 */

/**
 * Builds a well-formed userStory document, applying sane defaults
 * for fields the AI response (or caller) may omit.
 * @param {Partial<UserStory>} data
 * @returns {UserStory}
 */
function buildUserStory(data = {}) {
  return {
    title: data.title || 'Untitled Story',
    description: data.description || '',
    promptSource: data.promptSource || '',
    status: data.status || 'pending',
    estimatedHours: typeof data.estimatedHours === 'number' ? data.estimatedHours : 0,
    scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
    googleEventId: data.googleEventId || null,
    isSynced: typeof data.isSynced === 'boolean' ? data.isSynced : false,
    projectName: data.projectName || 'Unassigned',
    createdAt: new Date(),
  };
}

const ALLOWED_STATUSES = ['pending', 'approved', 'rejected', 'synced'];

module.exports = { buildUserStory, ALLOWED_STATUSES };
