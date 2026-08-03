// Catches any request that doesn't match a defined route.
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
};

module.exports = notFound;
