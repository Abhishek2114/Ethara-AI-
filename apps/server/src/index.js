const app = require("./app");
const { env } = require("./config");
const prisma = require("./core/database/prisma");
const logger = require("./core/logger");
const { tokenService } = require("./shared/services");
const { initSocket } = require("./core/socket");

async function start() {
  await prisma.$connect();
  logger.info(`${env.appName} connected to database`);

  const server = app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`, {
      environment: env.nodeEnv,
      apiPrefix: "/api/v1",
    });
  });

  initSocket(server);

  const cleanupTimer = setInterval(() => {
    tokenService.cleanupExpiredTokens().catch((err) => {
      logger.error("Refresh token cleanup failed", { message: err.message });
    });
  }, env.tokenCleanupIntervalMs);

  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    clearInterval(cleanupTimer);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info("Database disconnected. Goodbye.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  logger.error("Failed to start server", { message: err.message, stack: err.stack });
  process.exit(1);
});
