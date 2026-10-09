export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);

  const isDuplicate = err.code === 11000;
  const isValidation = err.name === 'ValidationError' || err.name === 'CastError';
  const isDatabaseUnavailable = [
    'MongoNetworkError',
    'MongoServerSelectionError',
    'MongooseServerSelectionError',
  ].includes(err.name);
  const statusCode = isDuplicate
    ? 409
    : isValidation
      ? 400
      : isDatabaseUnavailable
        ? 503
        : err.statusCode || err.status || 500;
  const code = isDuplicate
    ? 'DUPLICATE_RECORD'
    : isValidation
      ? 'VALIDATION_ERROR'
      : isDatabaseUnavailable
        ? 'DATABASE_UNAVAILABLE'
        : err.code || 'SERVER_ERROR';
  const message = isDatabaseUnavailable
    ? 'The database is temporarily unavailable. Please try again shortly.'
    : err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
