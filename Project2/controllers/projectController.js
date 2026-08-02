// controllers/projectController.js
// Basic CRUD for the "projects" collection. Projects provide the
// "context" the AI can optionally use when generating stories.

const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { buildProject } = require('../models/project');

const COLLECTION = 'projects';

const createProject = async (req, res) => {
  try {
    const { projectName, context } = req.body;
    const doc = buildProject({ projectName, context });

    const db = getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);

    return res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error('createProject error:', err);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const db = getDb();
    const projects = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(projects);
  } catch (err) {
    console.error('getAllProjects error:', err);
    return res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project id.' });
    }

    const db = getDb();
    const project = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json(project);
  } catch (err) {
    console.error('getProjectById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve project.' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project id.' });
    }

    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json({ message: 'Project deleted.' });
  } catch (err) {
    console.error('deleteProject error:', err);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, deleteProject };
