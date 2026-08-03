const router = require('express').Router();
const usersController = require('../controllers/users');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Owner and walker profile management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: The requested user
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, role, phone]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jamie
 *               lastName:
 *                 type: string
 *                 example: Rivera
 *               email:
 *                 type: string
 *                 example: jamie.rivera@example.com
 *               role:
 *                 type: string
 *                 enum: [owner, walker]
 *                 example: owner
 *               phone:
 *                 type: string
 *                 example: 208-555-0134
 *               bio:
 *                 type: string
 *                 example: Dog lover with two Labradors.
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [owner, walker]
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid id format or validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid id format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
