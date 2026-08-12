const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { validateReview } = require('../models/review');

// GET /reviews
const getAllReviews = async (req, res) => {
  try {
    const db = getDb();
    const reviews = await db.collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reviews.', error: err.message });
  }
};

// GET /reviews/:id
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }
    const db = getDb();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving review.', error: err.message });
  }
};

// POST /reviews (protected)
const createReview = async (req, res) => {
  try {
    const errors = validateReview(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();

    if (!ObjectId.isValid(req.body.walkScheduleId)) {
      return res.status(400).json({ message: 'Invalid walkScheduleId format.' });
    }
    const schedule = await db
      .collection('walkSchedules')
      .findOne({ _id: new ObjectId(req.body.walkScheduleId) });
    if (!schedule) {
      return res.status(400).json({ message: 'walkScheduleId does not match an existing walk schedule.' });
    }

    if (!ObjectId.isValid(req.body.reviewerId) || !ObjectId.isValid(req.body.walkerId)) {
      return res.status(400).json({ message: 'Invalid reviewerId or walkerId format.' });
    }

    const newReview = {
      walkScheduleId: req.body.walkScheduleId,
      reviewerId: req.body.reviewerId,
      walkerId: req.body.walkerId,
      rating: Number(req.body.rating),
      comment: req.body.comment || '',
      createdAt: new Date()
    };

    const result = await db.collection('reviews').insertOne(newReview);
    res.status(201).json({ _id: result.insertedId, ...newReview });
  } catch (err) {
    res.status(500).json({ message: 'Error creating review.', error: err.message });
  }
};

// PUT /reviews/:id (protected)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }

    const errors = validateReview(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const db = getDb();
    const updateFields = { ...req.body, updatedAt: new Date() };
    if (updateFields.rating !== undefined) {
      updateFields.rating = Number(updateFields.rating);
    }
    delete updateFields._id;

    const result = await db
      .collection('reviews')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review.', error: err.message });
  }
};

// DELETE /reviews/:id
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }

    const db = getDb();
    const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review.', error: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
