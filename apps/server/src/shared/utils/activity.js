const prisma = require("../../core/database/prisma");

async function logActivity({ action, userId, projectId, metadata }) {
  return prisma.activity.create({
    data: { action, userId, projectId, metadata: metadata || undefined },
  });
}

module.exports = { logActivity };
