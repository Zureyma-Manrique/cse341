const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { validateDog } = require('../models/dog');

// GET /dogs
const getAllDogs = async (req, res) => {
  try {
    const db = getDb();
    const dogs = await db.collection('dogs').find().toArray();
    res.status(200).json(dogs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving dogs.', error: err.message });
  }
};

// GET /dogs/:id
const getDogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid dog id format.' });
    }
    const db = getDb();
    const dog = await db.collection('dogs').findOne({ _id: new ObjectId(id) });
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found.' });
    }
    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving dog.', error: err.message });
  }
};

// GET /dogs/owner/:ownerId
const getDogsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: 'Invalid owner id format.' });
    }
    const db = getDb();
    const dogs = await db.collection('dogs').find({ ownerId }).toArray();
    res.status(200).json(dogs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving dogs for owner.', error: err.message });
  }
};

// POST /dogs
const createDog = async (req, res) => {
  try {
    const errors = validateDog(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();

    if (!ObjectId.isValid(req.body.ownerId)) {
      return res.status(400).json({ message: 'Invalid ownerId format.' });
    }
    const owner = await db.collection('users').findOne({ _id: new ObjectId(req.body.ownerId) });
    if (!owner) {
      return res.status(400).json({ message: 'ownerId does not match an existing user.' });
    }

    const newDog = {
      name: req.body.name,
      breed: req.body.breed,
      age: Number(req.body.age),
      size: req.body.size,
      ownerId: req.body.ownerId,
      specialInstructions: req.body.specialInstructions || '',
      createdAt: new Date()
    };

    const result = await db.collection('dogs').insertOne(newDog);
    res.status(201).json({ _id: result.insertedId, ...newDog });
  } catch (err) {
    res.status(500).json({ message: 'Error creating dog.', error: err.message });
  }
};

// PUT /dogs/:id
const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid dog id format.' });
    }

    const errors = validateDog(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();
    const updateFields = { ...req.body, updatedAt: new Date() };
    if (updateFields.age !== undefined) {
      updateFields.age = Number(updateFields.age);
    }
    delete updateFields._id;

    const result = await db
      .collection('dogs')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Dog not found.' });
    }
    res.status(200).json({ message: 'Dog updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating dog.', error: err.message });
  }
};

// DELETE /dogs/:id
const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid dog id format.' });
    }

    const db = getDb();
    const result = await db.collection('dogs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Dog not found.' });
    }
    res.status(200).json({ message: 'Dog deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting dog.', error: err.message });
  }
};

module.exports = {
  getAllDogs,
  getDogById,
  getDogsByOwner,
  createDog,
  updateDog,
  deleteDog
};
