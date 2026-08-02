// server.js
// Application entry point: loads env vars, connects to MongoDB once,
// wires up middleware/routes, and only starts listening after the
// database connection succeeds.

require('dotenv').config();
const express = require('express');
const { connectDB, closeDB } = require('./db/connect');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Global middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logger (helpful during grading/demo videos)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ---- Routes ----
app.use('/', routes);

// ---- 404 fallback ----
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ---- Centralized error handler (catches anything next(err) is called with) ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ---- Bootstrap: connect to Mongo first, then listen ----
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Calendar Agent API listening on port ${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

start();

module.exports = app;
