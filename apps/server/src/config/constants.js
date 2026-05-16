const API_PREFIX = "/api";

const ROLES = Object.freeze({
  PROJECT_LEAD: "PROJECT_LEAD",
  QUALITY_REVIEWER: "QUALITY_REVIEWER",
  TASKER: "TASKER",
  ADMIN: "ADMIN",
});

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_PATH = `${API_PREFIX}/auth`;

const JWT_ISSUER = "ethara-task-track";
const JWT_AUDIENCE = "ethara-api";

module.exports = {
  API_PREFIX,
  ROLES,
  REFRESH_COOKIE,
  REFRESH_COOKIE_PATH,
  JWT_ISSUER,
  JWT_AUDIENCE,
};
