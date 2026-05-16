const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { logActivity } = require("../../shared/utils/activity");
const projectsService = require("../projects/projects.service");

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true, avatar: true } },
  project: { select: { id: true, title: true, status: true } },
};

async function assertProjectAccess(projectId, user) {
  const ids = await projectsService.getAccessibleProjectIds(user.id, user.role);
  if (!ids.includes(projectId)) {
    throw new AppError("Project not found", 404, "NOT_FOUND");
  }
}

async function listTasks(user, filters = {}) {
  const projectIds = await projectsService.getAccessibleProjectIds(user.id, user.role);
  const where = {
    projectId: filters.projectId
      ? projectIds.includes(filters.projectId)
        ? filters.projectId
        : "none"
      : { in: projectIds },
  };
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

async function getTask(id, user) {
  const task = await prisma.task.findUnique({ where: { id }, include: taskInclude });
  if (!task) throw new AppError("Task not found", 404, "NOT_FOUND");
  await assertProjectAccess(task.projectId, user);
  return task;
}

async function createTask(data, user) {
  await assertProjectAccess(data.projectId, user);
  const maxOrder = await prisma.task.aggregate({
    where: { projectId: data.projectId, status: data.status || "TODO" },
    _max: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || "TODO",
      priority: data.priority || "MEDIUM",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedToId: data.assignedToId || null,
      projectId: data.projectId,
      order: (maxOrder._max.order ?? -1) + 1,
    },
    include: taskInclude,
  });

  await logActivity({
    action: "created task",
    userId: user.id,
    projectId: task.projectId,
    metadata: { task: task.title },
  });

  return task;
}

async function updateTask(id, data, user) {
  const existing = await getTask(id, user);
  const task = await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      assignedToId: data.assignedToId,
      order: data.order,
    },
    include: taskInclude,
  });

  if (data.status && data.status !== existing.status) {
    await logActivity({
      action: "updated task status",
      userId: user.id,
      projectId: task.projectId,
      metadata: { task: task.title, from: existing.status, to: data.status },
    });
  }

  return task;
}

async function deleteTask(id, user) {
  const task = await getTask(id, user);
  await prisma.task.delete({ where: { id } });
  await logActivity({
    action: "deleted task",
    userId: user.id,
    projectId: task.projectId,
    metadata: { task: task.title },
  });
}

async function reorderTasks(updates, user) {
  const results = [];
  for (const { id, status, order } of updates) {
    const task = await getTask(id, user);
    const updated = await prisma.task.update({
      where: { id },
      data: { status, order },
      include: taskInclude,
    });
    results.push(updated);
  }
  return results;
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
