const router = require('express').Router();
const { passport } = require('../config/passport');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Google OAuth login/logout
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth login (open in a browser, not Swagger/REST client)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google's consent screen
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: OAuth callback Google redirects to after consent
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to /auth/success or /auth/failure
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
  })
);

router.get('/success', (req, res) => {
  res.status(200).json({
    message: 'Logged in successfully.',
    user: req.user ? { firstName: req.user.firstName, email: req.user.email } : null
  });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed.' });
});

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get the currently logged-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The current session's user
 *       401:
 *         description: Not logged in
 */
router.get('/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  return res.status(401).json({ message: 'Not logged in.' });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out and destroy the session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});

module.exports = router;
