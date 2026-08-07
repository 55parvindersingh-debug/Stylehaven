function notFound(req, res) { return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
function errorHandler(error, _req, res, _next) {
  let status = error.status || 500;
  let message = error.message || 'An unexpected server error occurred.';
  if (error.name === 'ValidationError') { status = 400; message = Object.values(error.errors).map((item) => item.message).join(' '); }
  if (error.name === 'CastError') { status = 400; message = 'The supplied record identifier is invalid.'; }
  if (error.code === 11000) { status = 409; const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'value'; message = `A record with this ${field} already exists.`; }
  if (error.message === 'This origin is not allowed by the CORS policy.') status = 403;
  if (process.env.NODE_ENV !== 'test') console.error(error);
  return res.status(status).json({ message, ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}) });
}
module.exports = { notFound, errorHandler };
