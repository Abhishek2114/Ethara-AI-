const { PrismaClient } = require("@prisma/client");
const { env } = require("../../config");

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    log: env.isDevelopment ? ["warn", "error"] : ["error"],
  });

if (env.isDevelopment) {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
