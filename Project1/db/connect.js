const { MongoClient } = require('mongodb');

let _client;
let _db;

const initDb = async () => {
  if (_db) {
    console.log('Db is already initialized!');
    return _db;
  }

  _client = new MongoClient(process.env.MONGODB_URI);
  await _client.connect();
  // Your connection string has no db name in the path, so name it explicitly
  // (otherwise the driver falls back to a database called "test").
  _db = _client.db(process.env.DB_NAME || 'contactsDB');
  console.log(`Connected to MongoDB (db: ${_db.databaseName})`);
  return _db;
};

const getDb = () => {
  if (!_db) {
    throw new Error('Db not initialized. Call initDb first.');
  }
  return _db;
};

module.exports = { initDb, getDb };
