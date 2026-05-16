const { applySecurityMiddleware, createAuthRateLimiter } = require("./security.middleware");
const { authenticate, requireAdmin } = require("./auth.middleware");
const { authorizeRoles, authorizeAdmin } = require("./authorize.middleware");
const validate = require("./validate.middleware");
const { notFoundHandler, errorHandler } = require("./error.middleware");

module.exports = {
  applySecurityMiddleware,
  createAuthRateLimiter,
  authenticate,
  requireAdmin,
  authorizeRoles,
  authorizeAdmin,
  validate,
  notFoundHandler,
  errorHandler,
};
