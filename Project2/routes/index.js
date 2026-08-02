// routes/index.js
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger-output.json');

const userStoryRoutes = require('./userStoryRoutes');
const projectRoutes = require('./projectRoutes');
const authRoutes = require('./authRoutes');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/auth', authRoutes);
router.use('/userStories', userStoryRoutes);
router.use('/projects', projectRoutes);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Calendar Agent API is running.',
    docs: '/api-docs',
  });
});

module.exports = router;
