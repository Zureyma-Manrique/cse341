// middleware/auth.js
// Guards routes so unauthenticated requests get a clean 401 instead of
// silently falling through, satisfying the "view things that aren't
// available if not logged in" requirement.

/**
 * Requires an active, logged-in session (set by Passport after Google OAuth).
 * Attach to any route/router that should be hidden from anonymous users.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: 'You must be logged in to access this resource. Visit /auth/google to sign in.',
  });
}

module.exports = { ensureAuthenticated };
