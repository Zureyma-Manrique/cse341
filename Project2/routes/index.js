// routes/index.js
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger-output.json');

const userStoryRoutes = require('./userStoryRoutes');
const projectRoutes = require('./projectRoutes');
const authRoutes = require('./authRoutes');

// swagger-autogen bakes a static "host" into swagger-output.json at
// generation time (e.g. "localhost:3000" if you ran `npm run swagger`
// locally). If that file is then deployed as-is, Swagger UI's "Try it
// out" button keeps sending requests to that stale host instead of
// wherever it's actually being viewed from. Patching host/schemes from
// the real incoming request fixes this for both localhost and Render
// with no extra env vars required.
router.use(
  '/api-docs',
  swaggerUi.serve,
  (req, res, next) => {
    const liveDoc = {
      ...swaggerDocument,
      host: req.get('host'),
      schemes: [req.protocol],
    };
    swaggerUi.setup(liveDoc)(req, res, next);
  }
);
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
