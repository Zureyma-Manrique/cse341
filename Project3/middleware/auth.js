// middleware/auth.js
// Guards routes so unauthenticated requests get a clean 401 instead of
// silently falling through. Attach to any route that should require login.

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    message: 'You must be logged in to access this resource. Visit /auth/google to sign in.'
  });
}

module.exports = { ensureAuthenticated };
