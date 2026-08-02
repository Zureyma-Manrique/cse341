const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const COLLECTION = 'contacts';

// GET /contacts - return all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await getDb().collection(COLLECTION).find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /contacts/:id - return a single contact by id
const getContactById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id format.' });
    }
    const contact = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' });
    }
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /contacts - create a new contact. All fields required.
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error:
          'All fields are required: firstName, lastName, email, favoriteColor, birthday.',
      });
    }

    const newContact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await getDb().collection(COLLECTION).insertOne(newContact);

    // Return the new contact's id in the response body, per rubric.
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /contacts/:id - update an existing contact
const updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id format.' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error:
          'All fields are required: firstName, lastName, email, favoriteColor, birthday.',
      });
    }

    const updatedContact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await getDb()
      .collection(COLLECTION)
      .replaceOne({ _id: new ObjectId(id) }, updatedContact);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found.' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /contacts/:id - delete a contact
const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id format.' });
    }

    const result = await getDb()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found.' });
    }

    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
