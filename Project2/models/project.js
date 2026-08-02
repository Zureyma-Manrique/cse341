// models/project.js
// Canonical shape for the "projects" collection.

/**
 * @typedef {Object} Project
 * @property {string} projectName
 * @property {string} context   - Free-text context/notes the AI uses when generating stories
 * @property {Date}   createdAt
 */

/**
 * @param {Partial<Project>} data
 * @returns {Project}
 */
function buildProject(data = {}) {
  return {
    projectName: data.projectName || 'Untitled Project',
    context: data.context || '',
    createdAt: new Date(),
  };
}

module.exports = { buildProject };
