// routes/userStoryRoutes.js
const router = require('express').Router();
const {
  generateStories,
  getPendingStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require('../controllers/userStoryController');
const {
  validateGenerateStories,
  validateUpdateStory,
  validateIdParam,
} = require('../middleware/validators');

/* #swagger.tags = ['User Stories'] */

// POST /userStories/generate  -> AI-powered story generation from a prompt
router.post('/generate', validateGenerateStories, generateStories);

// GET /userStories  -> all stories with status "pending"
router.get('/', getPendingStories);

// GET /userStories/:id  -> a single story
router.get('/:id', validateIdParam, getStoryById);

// PUT /userStories/:id  -> update status (e.g., approve) or edit fields
router.put('/:id', validateUpdateStory, updateStory);

// DELETE /userStories/:id  -> remove a story
router.delete('/:id', validateIdParam, deleteStory);

module.exports = router;
