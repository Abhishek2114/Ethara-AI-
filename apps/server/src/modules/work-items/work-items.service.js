const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");
const { logActivity, notifyUser } = require("../../shared/services/activity.service");

async function listForReview(user, { filter = "all", projectId } = {}) {
  const ids = await getTaskerIdsForReviewer(user);
  const where = { userId: { in: ids } };

  if (filter === "needs_review") {
    where.status = "COMPLETED";
    where.qualityScore = null;
  } else if (filter === "reviewed") {
    where.qualityScore = { not: null };
  } else {
    where.status = { in: ["COMPLETED", "IN_PROGRESS"] };
  }

  if (projectId) where.projectId = projectId;

  return prisma.workItem.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      project: { select: { id: true, code: true } },
      reviewedBy: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
}

async function reviewItem(id, user, { qualityScore, reviewComment }) {
  const ids = await getTaskerIdsForReviewer(user);
  const item = await prisma.workItem.findUnique({
    where: { id },
    include: { user: true, project: true },
  });
  if (!item || !ids.includes(item.userId)) {
    throw new AppError("Work item not found", 404, "NOT_FOUND");
  }

  const updated = await prisma.workItem.update({
    where: { id },
    data: {
      qualityScore: qualityScore / 100,
      reviewComment: reviewComment || null,
      reviewedAt: new Date(),
      reviewedById: user.id,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      project: { select: { code: true } },
      reviewedBy: { select: { name: true } },
    },
  });

  await logActivity({
    type: "TASK_REVIEWED",
    message: `${user.name} scored "${item.title}" at ${qualityScore}%`,
    actorId: user.id,
    entityId: item.id,
    entityType: "work_item",
  });

  if (item.user.qualityReviewerId) {
    await notifyUser(item.userId, {
      title: "Task reviewed",
      message: `Your task "${item.title}" was scored ${qualityScore}%`,
      type: "TASK_REVIEWED",
      link: "/task-review",
    });
  }

  return updated;
}

async function listByProject(projectId) {
  return prisma.workItem.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function createItem(user, data) {
  return prisma.workItem.create({
    data: {
      title: data.title,
      projectId: data.projectId || null,
      userId: data.assignTo || user.id,
      status: "PENDING",
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });
}

async function updateStatus(id, user, status) {
  const item = await prisma.workItem.findUnique({ where: { id } });
  if (!item) throw new AppError("Work item not found", 404, "NOT_FOUND");
  
  // Basic RBAC: the assigned user or an Admin/Project Lead can update status
  if (item.userId !== user.id && user.role !== "ADMIN" && user.role !== "PROJECT_LEAD") {
    throw new AppError("Not authorized to update this task", 403, "FORBIDDEN");
  }

  const updated = await prisma.workItem.update({
    where: { id },
    data: { 
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  await logActivity({
    type: status === "COMPLETED" ? "WORK_COMPLETED" : "CHECK_IN",
    message: `${user.name} marked task "${item.title}" as ${status}`,
    actorId: user.id,
    entityId: item.id,
    entityType: "work_item",
  });

  return updated;
}

module.exports = { listForReview, reviewItem, listByProject, createItem, updateStatus };
