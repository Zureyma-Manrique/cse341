const router = require('express').Router();
const reviewsController = require('../controllers/reviews');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Owner reviews of walkers after a completed walk
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews
 *       500:
 *         description: Server error
 */
router.get('/', reviewsController.getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     responses:
 *       200:
 *         description: The requested review
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get('/:id', reviewsController.getReviewById);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review (requires login)
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [walkScheduleId, reviewerId, walkerId, rating]
 *             properties:
 *               walkScheduleId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d3
 *               reviewerId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               walkerId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great walker, very reliable!
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not logged in
 *       500:
 *         description: Server error
 */
router.post('/', ensureAuthenticated, reviewsController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update an existing review (requires login)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       400:
 *         description: Invalid id format or validation error
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ensureAuthenticated, reviewsController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     responses:
 *       200:
 *         description: Review deleted
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
