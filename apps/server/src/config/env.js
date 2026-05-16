require("dotenv").config();

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
  appName: process.env.APP_NAME || "Ethara AI API",
  databaseUrl: requireEnv("DATABASE_URL"),
  jwt: {
    accessSecret: requireEnv("JWT_ACCESS_SECRET"),
    refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim()),
  cookieSecure: process.env.COOKIE_SECURE === "true",
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200,
    authMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  },
  tokenCleanupIntervalMs:
    Number(process.env.TOKEN_CLEANUP_INTERVAL_MS) || 60 * 60 * 1000,
};

module.exports = env;
