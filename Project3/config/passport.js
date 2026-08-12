// config/passport.js
// Configures Passport's Google OAuth 2.0 strategy against the existing
// "users" collection. On first login we insert a new user document
// (role defaults to "owner"); on repeat logins we just bump lastLoginAt.
// Sessions store only the Mongo _id (serializeUser); deserializeUser
// looks the full user back up on every request.

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const USERS_COLLECTION = 'users';

function configurePassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      'GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET are not set in the environment. ' +
        "Add them to your .env file locally, or to your Render service's Environment tab in production. " +
        'Get credentials at https://console.cloud.google.com/apis/credentials'
    );
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const db = getDb();
          const users = db.collection(USERS_COLLECTION);

          const existing = await users.findOne({ oauthProvider: 'google', oauthId: profile.id });

          if (existing) {
            await users.updateOne({ _id: existing._id }, { $set: { lastLoginAt: new Date() } });
            return done(null, { ...existing, lastLoginAt: new Date() });
          }

          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const [firstName, ...rest] = (profile.displayName || 'Google User').split(' ');

          const newUser = {
            firstName: firstName || 'Google',
            lastName: rest.join(' ') || 'User',
            email,
            role: 'owner',
            phone: '',
            oauthProvider: 'google',
            oauthId: profile.id,
            bio: '',
            createdAt: new Date()
          };

          const result = await users.insertOne(newUser);
          return done(null, { _id: result.insertedId, ...newUser });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Only the user's Mongo _id is stored in the session cookie payload.
  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  // On every authenticated request, look the full user doc back up.
  passport.deserializeUser(async (id, done) => {
    try {
      const db = getDb();
      const user = await db.collection(USERS_COLLECTION).findOne({ _id: new ObjectId(id) });
      done(null, user || false);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = { passport, configurePassport };
