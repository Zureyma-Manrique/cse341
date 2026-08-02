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

// POST /userStories/generate  -> AI-powered story generation from a prompt
router.post(
  '/generate',
  /* #swagger.tags = ['User Stories'] */
  /* #swagger.parameters['body'] = { in: 'body', description: 'Natural language prompt to generate stories from.', schema: { $ref: '#/definitions/GeneratePromptRequest' } } */
  validateGenerateStories,
  generateStories
);

// GET /userStories  -> all stories with status "pending"
router.get('/', /* #swagger.tags = ['User Stories'] */ getPendingStories);

// GET /userStories/:id  -> a single story
router.get('/:id', /* #swagger.tags = ['User Stories'] */ validateIdParam, getStoryById);

// PUT /userStories/:id  -> update status (e.g., approve) or edit fields
router.put(
  '/:id',
  /* #swagger.tags = ['User Stories'] */
  /* #swagger.parameters['body'] = { in: 'body', description: 'Fields to update on the story.', schema: { $ref: '#/definitions/UpdateStoryRequest' } } */
  validateUpdateStory,
  updateStory
);

// DELETE /userStories/:id  -> remove a story
router.delete('/:id', /* #swagger.tags = ['User Stories'] */ validateIdParam, deleteStory);

module.exports = router;
