// routes/projectRoutes.js
const router = require('express').Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require('../controllers/projectController');
const { validateCreateProject, validateProjectIdParam } = require('../middleware/validators');
const { ensureAuthenticated } = require('../middleware/auth');

// Every route below requires an active login session (Google OAuth).
router.use(ensureAuthenticated);

router.post(
  '/',
  /* #swagger.tags = ['Projects'] */
  /* #swagger.security = [{ "googleOAuth": [] }] */
  /* #swagger.parameters['body'] = { in: 'body', description: 'New project details.', schema: { $ref: '#/definitions/CreateProjectRequest' } } */
  validateCreateProject,
  createProject
);
router.get(
  '/',
  /* #swagger.tags = ['Projects'] */
  /* #swagger.security = [{ "googleOAuth": [] }] */
  getAllProjects
);
router.get(
  '/:id',
  /* #swagger.tags = ['Projects'] */
  /* #swagger.security = [{ "googleOAuth": [] }] */
  validateProjectIdParam,
  getProjectById
);
router.delete(
  '/:id',
  /* #swagger.tags = ['Projects'] */
  /* #swagger.security = [{ "googleOAuth": [] }] */
  validateProjectIdParam,
  deleteProject
);

module.exports = router;
