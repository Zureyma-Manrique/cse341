// routes/authRoutes.js
const router = require('express').Router();
const passport = require('passport');

/* #swagger.tags = ['Auth'] */

// GET /auth/google -> redirects the browser to Google's consent screen.
router.get(
  '/google',
  /* #swagger.description = 'Redirects to Google OAuth consent screen.' */
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback -> Google redirects back here after consent.
router.get(
  '/google/callback',
  /* #swagger.description = 'OAuth callback Google redirects to after login.' */
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success',
  })
);

// Simple JSON landing points instead of a frontend, since this project has none.
router.get('/success', (req, res) => {
  res.status(200).json({
    message: 'Logged in successfully.',
    user: req.user
      ? { displayName: req.user.displayName, email: req.user.email }
      : null,
  });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Google authentication failed.' });
});

// GET /auth/user -> returns the current session's user, or 401 if none.
router.get('/user', (req, res) => {
  /* #swagger.description = 'Returns the currently logged-in user, or 401 if not authenticated.' */
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      _id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
    });
  }
  return res.status(401).json({ error: 'Not logged in.' });
});

// GET /auth/logout -> destroys the session.
router.get('/logout', (req, res, next) => {
  /* #swagger.description = 'Logs the current user out and destroys the session.' */
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});

module.exports = router;
