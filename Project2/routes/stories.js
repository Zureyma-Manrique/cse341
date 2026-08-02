const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/stories');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validatePrompt = [
  body('prompt').notEmpty().withMessage('A prompt is required to generate stories.').isString()
];

// Error checking middleware
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', validatePrompt, checkValidation, storiesController.generateStories);
router.get('/pending', storiesController.getPendingStories);

module.exports = router;