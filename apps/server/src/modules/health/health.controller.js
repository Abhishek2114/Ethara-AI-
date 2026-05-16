const prisma = require("../../core/database/prisma");
const { env } = require("../../config");
const { catchAsync, sendSuccess } = require("../../core/http");

const getHealth = catchAsync(async (_req, res) => {
  sendSuccess(res, {
    data: {
      status: "ok",
      service: env.appName,
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

const getReadiness = catchAsync(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  sendSuccess(res, {
    data: {
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = { getHealth, getReadiness };
