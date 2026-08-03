const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { validateUser } = require('../models/user');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users.', error: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id format.' });
    }
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user.', error: err.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();

    const existing = await db.collection('users').findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      oauthProvider: req.body.oauthProvider || null,
      oauthId: req.body.oauthId || null,
      bio: req.body.bio || '',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ _id: result.insertedId, ...newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user.', error: err.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id format.' });
    }

    const errors = validateUser(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();
    const updateFields = { ...req.body, updatedAt: new Date() };
    delete updateFields._id;

    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user.', error: err.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id format.' });
    }

    const db = getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
