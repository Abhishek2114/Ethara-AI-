const prisma = require("../../core/database/prisma");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");

const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

async function getInbox(user) {
  const isManager = MANAGER_ROLES.includes(user.role);
  const taskerIds = await getTaskerIdsForReviewer(user);

  const [pendingLeaves, pendingReviews, recentFlags, notifications] = await Promise.all([
    isManager
      ? prisma.leaveRequest.findMany({
          where: { userId: { in: taskerIds }, status: "PENDING" },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        })
      : [],
    isManager
      ? prisma.workItem.findMany({
          where: {
            userId: { in: taskerIds },
            status: "COMPLETED",
            qualityScore: null,
          },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            project: { select: { id: true, code: true } },
          },
          orderBy: { completedAt: "desc" },
          take: 10,
        })
      : [],
    user.role === "PROJECT_LEAD" || user.role === "ADMIN"
      ? prisma.projectFlag.findMany({
          include: {
            project: { select: { id: true, code: true } },
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [],
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const actionCount = pendingLeaves.length + pendingReviews.length + recentFlags.length;

  return {
    pendingLeaves,
    pendingReviews,
    recentFlags,
    notifications,
    actionCount,
    unreadNotifications: notifications.length,
  };
}

module.exports = { getInbox };
