// db/connect.js
// Clean singleton connection to MongoDB using the native driver.
// The client is created once and reused across the whole application
// (controllers pull the same DB instance via getDb()).

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment (.env file).');
}

// Singleton state — module-level variables persist for the life of the process,
// so re-requiring this file never opens a second connection.
let client;
let db;

/**
 * Initializes the MongoDB client and caches the database handle.
 * Call this once at server startup, before the app starts listening.
 * @returns {Promise<import('mongodb').Db>}
 */
async function connectDB() {
  if (db) {
    // Already connected — return the cached instance instead of reconnecting.
    return db;
  }

  client = new MongoClient(uri, {
    maxPoolSize: 10,
  });

  await client.connect();

  // Database name is taken from the connection string; falls back to 'calendarAgent'.
  db = client.db(process.env.MONGODB_DB_NAME || 'calendarAgent');

  console.log(`MongoDB connected -> database: ${db.databaseName}`);
  return db;
}

/**
 * Returns the cached Db instance. Throws if connectDB() hasn't run yet,
 * which prevents controllers from silently querying an undefined db.
 * @returns {import('mongodb').Db}
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() before getDb().');
  }
  return db;
}

/**
 * Gracefully closes the client (used on process shutdown).
 */
async function closeDB() {
  if (client) {
    await client.close();
    db = undefined;
    console.log('MongoDB connection closed.');
  }
}

module.exports = { connectDB, getDb, closeDB };
