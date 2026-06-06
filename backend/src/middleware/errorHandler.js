function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Внутрішня помилка сервера';
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
