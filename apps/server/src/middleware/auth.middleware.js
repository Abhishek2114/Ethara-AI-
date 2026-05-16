const { tokenService } = require("../shared/services");
const authService = require("../modules/auth/auth.service");
const { AppError } = require("../core/errors");
const { catchAsync } = require("../core/http");

const authenticate = catchAsync(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  const token = header.slice(7);
  let decoded;
  try {
    decoded = tokenService.verifyAccessToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Access token expired", 401, "TOKEN_EXPIRED");
    }
    throw new AppError("Invalid access token", 401, "INVALID_TOKEN");
  }

  if (!decoded.sub) throw new AppError("Invalid access token", 401, "INVALID_TOKEN");

  const user = await authService.getUserById(decoded.sub);
  if (!user.isActive) throw new AppError("Account is deactivated", 403, "ACCOUNT_INACTIVE");

  req.user = user;
  req.tokenPayload = decoded;
  next();
});

module.exports = { authenticate };
