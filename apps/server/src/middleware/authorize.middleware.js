const { AppError } = require("../core/errors");
const { ROLES } = require("../config/constants");

function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403, "FORBIDDEN"));
    }
    next();
  };
}

const authorizeAdmin = authorizeRoles(ROLES.ADMIN);

module.exports = { authorizeRoles, authorizeAdmin };
