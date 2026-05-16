const prisma = require("../../core/database/prisma");

async function logActivity({ type, message, actorId, entityId, entityType }) {
  return prisma.activity.create({
    data: { type, message, actorId, entityId, entityType },
    include: { actor: { select: { id: true, name: true, avatar: true } } },
  });
}

async function notifyUser(userId, { title, message, type, link }) {
  return prisma.notification.create({
    data: { userId, title, message, type, link },
  });
}

async function listActivities(user, { limit = 30 } = {}) {
  const { getTaskerIdsForReviewer } = require("../../modules/dashboard/dashboard.service");
  const taskerIds = await getTaskerIdsForReviewer(user);
  const actorIds =
    user.role === "TASKER"
      ? [user.id, user.qualityReviewerId, user.reportingToId].filter(Boolean)
      : [user.id, ...taskerIds];

  return prisma.activity.findMany({
    where: {
      OR: [{ actorId: { in: actorIds } }, { actorId: null }],
    },
    include: { actor: { select: { id: true, name: true, avatar: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

module.exports = { logActivity, notifyUser, listActivities };
