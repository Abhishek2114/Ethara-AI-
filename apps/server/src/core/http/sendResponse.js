function sendSuccess(res, { statusCode = 200, data, message }) {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

function sendError(res, { statusCode = 500, code, message, details }) {
  const body = {
    success: false,
    error: { code, message },
  };
  if (details) body.error.details = details;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
