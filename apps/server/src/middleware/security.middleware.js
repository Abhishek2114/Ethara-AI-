const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const express = require("express");
const { env } = require("../config");

function applySecurityMiddleware(app) {
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

function createAuthRateLimiter() {
  return rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.authMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { code: "RATE_LIMIT", message: "Too many auth attempts" },
    },
  });
}

module.exports = { applySecurityMiddleware, createAuthRateLimiter };
