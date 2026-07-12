// One-time script to insert sample contacts.
// Run with: node seed.js
require('dotenv').config();
const { initDb, getDb } = require('./db/connect');

const sampleContacts = [
  {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    favoriteColor: 'purple',
    birthday: '1815-12-10',
  },
  {
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace@example.com',
    favoriteColor: 'navy',
    birthday: '1906-12-09',
  },
  {
    firstName: 'Alan',
    lastName: 'Turing',
    email: 'alan@example.com',
    favoriteColor: 'green',
    birthday: '1912-06-23',
  },
];

(async () => {
  try {
    await initDb();
    const result = await getDb().collection('contacts').insertMany(sampleContacts);
    console.log(`Inserted ${result.insertedCount} contacts.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
