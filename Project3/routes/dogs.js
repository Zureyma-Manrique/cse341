const router = require('express').Router();
const dogsController = require('../controllers/dogs');

/**
 * @swagger
 * tags:
 *   name: Dogs
 *   description: Dog profile management
 */

/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Get all dogs
 *     tags: [Dogs]
 *     responses:
 *       200:
 *         description: A list of dogs
 *       500:
 *         description: Server error
 */
router.get('/', dogsController.getAllDogs);

/**
 * @swagger
 * /dogs/owner/{ownerId}:
 *   get:
 *     summary: Get all dogs belonging to a specific owner
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owner (user)
 *     responses:
 *       200:
 *         description: A list of the owner's dogs
 *       400:
 *         description: Invalid owner id format
 *       500:
 *         description: Server error
 */
router.get('/owner/:ownerId', dogsController.getDogsByOwner);

/**
 * @swagger
 * /dogs/{id}:
 *   get:
 *     summary: Get a single dog by id
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the dog
 *     responses:
 *       200:
 *         description: The requested dog
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Server error
 */
router.get('/:id', dogsController.getDogById);

/**
 * @swagger
 * /dogs:
 *   post:
 *     summary: Create a new dog
 *     tags: [Dogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, breed, age, size, ownerId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Biscuit
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *               age:
 *                 type: number
 *                 example: 3
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *                 example: large
 *               ownerId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               specialInstructions:
 *                 type: string
 *                 example: Afraid of skateboards, avoid the park on 4th street.
 *     responses:
 *       201:
 *         description: Dog created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', dogsController.createDog);

/**
 * @swagger
 * /dogs/{id}:
 *   put:
 *     summary: Update an existing dog
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the dog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               specialInstructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dog updated
 *       400:
 *         description: Invalid id format or validation error
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Server error
 */
router.put('/:id', dogsController.updateDog);

/**
 * @swagger
 * /dogs/{id}:
 *   delete:
 *     summary: Delete a dog
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the dog
 *     responses:
 *       200:
 *         description: Dog deleted
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', dogsController.deleteDog);

module.exports = router;
