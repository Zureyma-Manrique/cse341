// Final safety net for any error that wasn't caught inside a controller's try/catch.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
