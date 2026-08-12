const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/dogs', require('./dogs'));
router.use('/walk-schedules', require('./walkSchedules'));
router.use('/reviews', require('./reviews'));

module.exports = router;
