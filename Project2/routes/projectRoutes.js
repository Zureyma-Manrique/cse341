// routes/projectRoutes.js
const router = require('express').Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require('../controllers/projectController');
const { validateCreateProject, validateProjectIdParam } = require('../middleware/validators');

router.post(
  '/',
  /* #swagger.tags = ['Projects'] */
  /* #swagger.parameters['body'] = { in: 'body', description: 'New project details.', schema: { $ref: '#/definitions/CreateProjectRequest' } } */
  validateCreateProject,
  createProject
);
router.get('/', /* #swagger.tags = ['Projects'] */ getAllProjects);
router.get('/:id', /* #swagger.tags = ['Projects'] */ validateProjectIdParam, getProjectById);
router.delete('/:id', /* #swagger.tags = ['Projects'] */ validateProjectIdParam, deleteProject);

module.exports = router;
