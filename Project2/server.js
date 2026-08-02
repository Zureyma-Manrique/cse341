// server.js
// Application entry point: loads env vars, connects to MongoDB once,
// wires up middleware/routes, and only starts listening after the
// database connection succeeds.

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const { connectDB, closeDB } = require('./db/connect');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined in the environment (.env file).');
}

// Render (and most PaaS hosts) terminate HTTPS at a proxy in front of the app,
// forwarding requests to your process over plain HTTP with an
// X-Forwarded-Proto header indicating the original scheme. Trusting the
// proxy unconditionally (not just when NODE_ENV=production, which Render
// does NOT set automatically) lets Express correctly report req.protocol
// and req.secure. It's a no-op locally, where there's no proxy in front of you.
app.set('trust proxy', 1);

// ---- Global middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions are persisted in MongoDB (same cluster as the app data) so
// logins survive server restarts/redeploys instead of living only in memory.
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
});

// Without this listener, a dropped connection to the session store can
// surface as an unhandled error and take the whole process down.
sessionStore.on('error', (err) => {
  console.error('Session store error:', err);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: 'auto', // sets Secure only when the request is actually HTTPS (works correctly behind Render's proxy now that trust proxy is set)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
