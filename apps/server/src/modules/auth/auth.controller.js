const { env, constants } = require("../../config");
const authService = require("./auth.service");
const { AppError } = require("../../core/errors");
const { catchAsync, sendSuccess } = require("../../core/http");

function requestMeta(req) {
  return { userAgent: req.headers["user-agent"], ipAddress: req.ip };
}

function setRefreshCookie(res, token) {
  res.cookie(constants.REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: constants.REFRESH_COOKIE_PATH,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(constants.REFRESH_COOKIE, { path: constants.REFRESH_COOKIE_PATH });
}

function getRefreshTokenFromRequest(req) {
  return req.cookies?.[constants.REFRESH_COOKIE] || req.body?.refreshToken;
}

const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, { statusCode: 201, data: { user } });
});

const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { data: { user, accessToken } });
});

const refresh = catchAsync(async (req, res) => {
  const token = getRefreshTokenFromRequest(req);
  if (!token) throw new AppError("Refresh token required", 401, "REFRESH_TOKEN_REQUIRED");
  const { user, accessToken, refreshToken } = await authService.refreshSession(token, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { data: { user, accessToken } });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(getRefreshTokenFromRequest(req));
  clearRefreshCookie(res);
  sendSuccess(res, { data: { message: "Logged out" } });
});

const logoutAll = catchAsync(async (req, res) => {
  await authService.logoutAll(req.user.id);
  clearRefreshCookie(res);
  sendSuccess(res, { data: { message: "All sessions revoked" } });
});

const me = catchAsync(async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
});

const reviewers = catchAsync(async (_req, res) => {
  const reviewers = await authService.listReviewers();
  sendSuccess(res, { data: { reviewers } });
});

module.exports = { register, login, refresh, logout, logoutAll, me, reviewers };
