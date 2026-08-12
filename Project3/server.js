require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');

const { initDb } = require('./db/connect');
const mainRoutes = require('./routes/index');
const swaggerSpec = require('./config/swagger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined in the environment (.env file).');
}

// Render (and most PaaS hosts) terminate HTTPS at a proxy in front of the app.
// Trusting the proxy lets Express correctly report req.protocol/req.secure,
// which express-session's "secure: auto" cookie option depends on.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions persisted in MongoDB so logins survive server restarts/redeploys.
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});
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
      secure: 'auto'
    }
  })
);

// Swagger UI docs, published at /api-docs as required by the assignment
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Paws & Paths API is running. Visit /api-docs for documentation.');
});

initDb((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    // Passport's Google strategy reads/writes the "users" collection, so it's
    // configured only after the DB connection is live.
    const { passport, configurePassport } = require('./config/passport');
    configurePassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', mainRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
  }
});

module.exports = app;
