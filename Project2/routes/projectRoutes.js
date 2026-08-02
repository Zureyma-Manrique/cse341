// routes/projectRoutes.js
const router = require('express').Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require('../controllers/projectController');
const { validateCreateProject, validateProjectIdParam } = require('../middleware/validators');

/* #swagger.tags = ['Projects'] */

router.post('/', validateCreateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', validateProjectIdParam, getProjectById);
router.delete('/:id', validateProjectIdParam, deleteProject);

module.exports = router;
