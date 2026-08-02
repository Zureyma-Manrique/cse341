// controllers/userStoryController.js
// Handles all business logic for the "userStories" collection:
// AI-assisted creation, listing pending stories, status updates, and deletion.

const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { generateUserStories } = require('../services/aiService');
const { buildUserStory, ALLOWED_STATUSES } = require('../models/userStory');

const COLLECTION = 'userStories';

/**
 * POST /userStories/generate
 * Accepts a natural-language "prompt", calls Gemini to break it into
 * structured user stories, maps the result onto the userStories schema,
 * and inserts the documents with status "pending" for human review.
 */
const generateStories = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Ask the LLM to turn the prompt into structured agile stories.
    const aiStories = await generateUserStories(prompt);

    // Map each AI-generated story onto our canonical schema.
    const documents = aiStories.map((story) =>
      buildUserStory({
        title: story.title,
        description: story.description,
        promptSource: prompt,
        status: 'pending',
        estimatedHours: story.estimatedHours,
        scheduledDate: story.scheduledDate,
        projectName: story.projectName,
        isSynced: false,
      })
    );

    const db = getDb();
    const result = await db.collection(COLLECTION).insertMany(documents);

    const inserted = documents.map((doc, i) => ({
      _id: result.insertedIds[i],
      ...doc,
    }));

    return res.status(201).json({
      message: `${inserted.length} user stor${inserted.length === 1 ? 'y' : 'ies'} generated and saved as pending.`,
      stories: inserted,
    });
  } catch (err) {
    console.error('generateStories error:', err);
    // A bad/empty prompt or a malformed AI response is a client-correctable issue.
    if (err.message && (err.message.includes('prompt') || err.message.includes('Gemini'))) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Failed to generate user stories.' });
  }
};

/**
 * GET /userStories
 * Retrieves all stories with status "pending" (awaiting user review).
 */
const getPendingStories = async (req, res) => {
  try {
    const db = getDb();
    const stories = await db
      .collection(COLLECTION)
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(stories);
  } catch (err) {
    console.error('getPendingStories error:', err);
    return res.status(500).json({ error: 'Failed to retrieve pending user stories.' });
  }
};

/**
 * GET /userStories/:id
 * Retrieves a single story by id (useful for review UIs / detail views).
 */
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid story id.' });
    }

    const db = getDb();
    const story = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!story) {
      return res.status(404).json({ error: 'User story not found.' });
    }

    return res.status(200).json(story);
  } catch (err) {
    console.error('getStoryById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve user story.' });
  }
};

/**
 * PUT /userStories/:id
 * Updates the status of a story (e.g., "pending" -> "approved" or "rejected").
 * Also allows editing core fields during review, if provided.
 */
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid story id.' });
    }

    const { status, title, description, estimatedHours, scheduledDate, projectName } = req.body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (estimatedHours !== undefined) updateFields.estimatedHours = estimatedHours;
    if (scheduledDate !== undefined) updateFields.scheduledDate = new Date(scheduledDate);
    if (projectName !== undefined) updateFields.projectName = projectName;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update.' });
    }

    const db = getDb();
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    if (!result) {
      return res.status(404).json({ error: 'User story not found.' });
    }

    return res.status(200).json({ message: 'User story updated.', story: result });
  } catch (err) {
    console.error('updateStory error:', err);
    return res.status(500).json({ error: 'Failed to update user story.' });
  }
};

/**
 * DELETE /userStories/:id
 * Removes a specific story by its ID.
 */
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid story id.' });
    }

    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User story not found.' });
    }

    return res.status(200).json({ message: 'User story deleted.' });
  } catch (err) {
    console.error('deleteStory error:', err);
    return res.status(500).json({ error: 'Failed to delete user story.' });
  }
};

module.exports = {
  generateStories,
  getPendingStories,
  getStoryById,
  updateStory,
  deleteStory,
  ALLOWED_STATUSES,
};
