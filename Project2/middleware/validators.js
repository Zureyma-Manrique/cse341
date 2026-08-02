// middleware/validators.js
// Centralized express-validator rule sets + a shared handler that
// short-circuits with a 400 if any rule fails.

const { body, param, validationResult } = require('express-validator');
const { ALLOWED_STATUSES } = require('../models/userStory');

/**
 * Run this as the last middleware in any validated chain.
 * Collects express-validator errors and returns 400 with details,
 * otherwise passes control to the controller.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ---- POST /userStories/generate ----
const validateGenerateStories = [
  body('prompt')
    .exists({ checkFalsy: true })
    .withMessage('prompt is required.')
    .isString()
    .withMessage('prompt must be a string.')
    .isLength({ min: 5, max: 2000 })
    .withMessage('prompt must be between 5 and 2000 characters.'),
  handleValidationErrors,
];

// ---- PUT /userStories/:id ----
const validateUpdateStory = [
  param('id').isMongoId().withMessage('A valid user story id is required.'),
  body('status')
    .optional()
    .isIn(ALLOWED_STATUSES)
    .withMessage(`status must be one of: ${ALLOWED_STATUSES.join(', ')}`),
  body('title').optional().isString().isLength({ min: 1, max: 200 }),
  body('description').optional().isString().isLength({ min: 1, max: 2000 }),
  body('estimatedHours').optional().isFloat({ min: 0, max: 1000 }),
  body('scheduledDate').optional().isISO8601().withMessage('scheduledDate must be a valid ISO 8601 date.'),
  body('projectName').optional().isString().isLength({ min: 1, max: 100 }),
  handleValidationErrors,
];

// ---- DELETE /userStories/:id & GET /userStories/:id ----
const validateIdParam = [
  param('id').isMongoId().withMessage('A valid user story id is required.'),
  handleValidationErrors,
];

// ---- POST /projects ----
const validateCreateProject = [
  body('projectName')
    .exists({ checkFalsy: true })
    .withMessage('projectName is required.')
    .isString()
    .isLength({ min: 1, max: 100 }),
  body('context').optional().isString().isLength({ max: 2000 }),
  handleValidationErrors,
];

const validateProjectIdParam = [
  param('id').isMongoId().withMessage('A valid project id is required.'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateGenerateStories,
  validateUpdateStory,
  validateIdParam,
  validateCreateProject,
  validateProjectIdParam,
};
