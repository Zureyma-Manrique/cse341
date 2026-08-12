const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { validateWalkSchedule } = require('../models/walkSchedule');

// GET /walk-schedules
const getAllWalkSchedules = async (req, res) => {
  try {
    const db = getDb();
    const schedules = await db.collection('walkSchedules').find().toArray();
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving walk schedules.', error: err.message });
  }
};

// GET /walk-schedules/:id
const getWalkScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid walk schedule id format.' });
    }
    const db = getDb();
    const schedule = await db.collection('walkSchedules').findOne({ _id: new ObjectId(id) });
    if (!schedule) {
      return res.status(404).json({ message: 'Walk schedule not found.' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving walk schedule.', error: err.message });
  }
};

// POST /walk-schedules (protected)
const createWalkSchedule = async (req, res) => {
  try {
    const errors = validateWalkSchedule(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();

    if (!ObjectId.isValid(req.body.dogId)) {
      return res.status(400).json({ message: 'Invalid dogId format.' });
    }
    const dog = await db.collection('dogs').findOne({ _id: new ObjectId(req.body.dogId) });
    if (!dog) {
      return res.status(400).json({ message: 'dogId does not match an existing dog.' });
    }

    if (!ObjectId.isValid(req.body.walkerId)) {
      return res.status(400).json({ message: 'Invalid walkerId format.' });
    }
    const walker = await db.collection('users').findOne({ _id: new ObjectId(req.body.walkerId) });
    if (!walker) {
      return res.status(400).json({ message: 'walkerId does not match an existing user.' });
    }

    const newSchedule = {
      dogId: req.body.dogId,
      walkerId: req.body.walkerId,
      scheduledDate: new Date(req.body.scheduledDate),
      duration: Number(req.body.duration),
      status: req.body.status,
      notes: req.body.notes || '',
      createdAt: new Date()
    };

    const result = await db.collection('walkSchedules').insertOne(newSchedule);
    res.status(201).json({ _id: result.insertedId, ...newSchedule });
  } catch (err) {
    res.status(500).json({ message: 'Error creating walk schedule.', error: err.message });
  }
};

// PUT /walk-schedules/:id (protected)
const updateWalkSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid walk schedule id format.' });
    }

    const errors = validateWalkSchedule(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();
    const updateFields = { ...req.body, updatedAt: new Date() };
    if (updateFields.scheduledDate !== undefined) {
      updateFields.scheduledDate = new Date(updateFields.scheduledDate);
    }
    if (updateFields.duration !== undefined) {
      updateFields.duration = Number(updateFields.duration);
    }
    delete updateFields._id;

    const result = await db
      .collection('walkSchedules')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Walk schedule not found.' });
    }
    res.status(200).json({ message: 'Walk schedule updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating walk schedule.', error: err.message });
  }
};

// DELETE /walk-schedules/:id
const deleteWalkSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid walk schedule id format.' });
    }

    const db = getDb();
    const result = await db.collection('walkSchedules').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Walk schedule not found.' });
    }
    res.status(200).json({ message: 'Walk schedule deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting walk schedule.', error: err.message });
  }
};

module.exports = {
  getAllWalkSchedules,
  getWalkScheduleById,
  createWalkSchedule,
  updateWalkSchedule,
  deleteWalkSchedule
};
