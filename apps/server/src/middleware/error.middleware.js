const { env } = require("../config");
const logger = require("../core/logger");

function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.isOperational ? err.message : "Internal server error";

  if (!err.isOperational) {
    logger.error(err.message, { stack: err.stack, code });
  }

  const body = {
    success: false,
    error: { code, message },
  };

  if (err.details) {
    body.error.details = err.details;
  }

  if (env.isDevelopment && !err.isOperational) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
