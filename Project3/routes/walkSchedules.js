const router = require('express').Router();
const walkSchedulesController = require('../controllers/walkSchedules');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: WalkSchedules
 *   description: Scheduling dog walks between owners and walkers
 */

/**
 * @swagger
 * /walk-schedules:
 *   get:
 *     summary: Get all walk schedules
 *     tags: [WalkSchedules]
 *     responses:
 *       200:
 *         description: A list of walk schedules
 *       500:
 *         description: Server error
 */
router.get('/', walkSchedulesController.getAllWalkSchedules);

/**
 * @swagger
 * /walk-schedules/{id}:
 *   get:
 *     summary: Get a single walk schedule by id
 *     tags: [WalkSchedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the walk schedule
 *     responses:
 *       200:
 *         description: The requested walk schedule
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Walk schedule not found
 *       500:
 *         description: Server error
 */
router.get('/:id', walkSchedulesController.getWalkScheduleById);

/**
 * @swagger
 * /walk-schedules:
 *   post:
 *     summary: Create a new walk schedule (requires login)
 *     tags: [WalkSchedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dogId, walkerId, scheduledDate, duration, status]
 *             properties:
 *               dogId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               walkerId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-20T15:00:00.000Z
 *               duration:
 *                 type: number
 *                 example: 30
 *               status:
 *                 type: string
 *                 enum: [requested, confirmed, completed, cancelled]
 *                 example: requested
 *               notes:
 *                 type: string
 *                 example: Meet at the north gate of the park.
 *     responses:
 *       201:
 *         description: Walk schedule created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not logged in
 *       500:
 *         description: Server error
 */
router.post('/', ensureAuthenticated, walkSchedulesController.createWalkSchedule);

/**
 * @swagger
 * /walk-schedules/{id}:
 *   put:
 *     summary: Update an existing walk schedule (requires login)
 *     tags: [WalkSchedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the walk schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [requested, confirmed, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Walk schedule updated
 *       400:
 *         description: Invalid id format or validation error
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Walk schedule not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ensureAuthenticated, walkSchedulesController.updateWalkSchedule);

/**
 * @swagger
 * /walk-schedules/{id}:
 *   delete:
 *     summary: Delete a walk schedule
 *     tags: [WalkSchedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the walk schedule
 *     responses:
 *       200:
 *         description: Walk schedule deleted
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Walk schedule not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', walkSchedulesController.deleteWalkSchedule);

module.exports = router;
