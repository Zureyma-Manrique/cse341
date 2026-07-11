const { MongoClient } = require('mongodb');
require('dotenv').config(); // This loads the variables from the .env file

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  // Connects using the hidden string
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = { initDb, getDb };