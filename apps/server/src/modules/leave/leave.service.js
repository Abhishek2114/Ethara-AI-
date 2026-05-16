const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");
const { logActivity, notifyUser } = require("../../shared/services/activity.service");

async function listLeaves(user, { status, startDate, endDate } = {}) {
  const where = {};

  if (user.role === "TASKER") {
    where.userId = user.id;
  } else if (user.role === "QUALITY_REVIEWER") {
    const ids = await getTaskerIdsForReviewer(user);
    where.userId = { in: ids };
  }

  if (status && status !== "ALL") where.status = status;
  if (startDate) where.startDate = { gte: new Date(startDate) };
  if (endDate) where.endDate = { lte: new Date(endDate) };

  return prisma.leaveRequest.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function createLeave(user, data) {
  const leave = await prisma.leaveRequest.create({
    data: {
      userId: user.id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
      status: "PENDING",
    },
    include: { user: { select: { id: true, name: true } } },
  });

  await logActivity({
    type: "LEAVE_REQUESTED",
    message: `${user.name} requested leave (${data.startDate} – ${data.endDate})`,
    actorId: user.id,
    entityId: leave.id,
    entityType: "leave",
  });

  const tasker = await prisma.user.findUnique({
    where: { id: user.id },
    select: { qualityReviewerId: true },
  });
  if (tasker?.qualityReviewerId) {
    await notifyUser(tasker.qualityReviewerId, {
      title: "Leave request",
      message: `${user.name} submitted a leave request`,
      type: "LEAVE_REQUESTED",
      link: "/leave",
    });
  }

  return leave;
}

async function updateLeaveStatus(id, status, user) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id }, include: { user: true } });
  if (!leave) throw new AppError("Leave request not found", 404, "NOT_FOUND");

  if (user.role === "TASKER" && leave.userId !== user.id) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  if (user.role === "QUALITY_REVIEWER") {
    const ids = await getTaskerIdsForReviewer(user);
    if (!ids.includes(leave.userId)) throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  const activityType = status === "APPROVED" ? "LEAVE_APPROVED" : "LEAVE_REJECTED";
  await logActivity({
    type: activityType,
    message: `${user.name} ${status.toLowerCase()} leave for ${leave.user.name}`,
    actorId: user.id,
    entityId: leave.id,
    entityType: "leave",
  });

  await notifyUser(leave.userId, {
    title: `Leave ${status.toLowerCase()}`,
    message: `Your leave request was ${status.toLowerCase()} by ${user.name}`,
    type: activityType,
    link: "/leave",
  });

  return updated;
}

module.exports = { listLeaves, createLeave, updateLeaveStatus };
