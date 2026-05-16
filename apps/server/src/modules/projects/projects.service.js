const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { logActivity, notifyUser } = require("../../shared/services/activity.service");

async function listProjects(user) {
  const where =
    user.role === "TASKER"
      ? { allocations: { some: { userId: user.id } } }
      : {};

  const projects = await prisma.project.findMany({
    where,
    include: {
      allocations: { include: { user: { select: { id: true, name: true } } } },
      flags: { orderBy: { createdAt: "desc" }, take: 1, include: { user: { select: { name: true } } } },
      _count: { select: { workItems: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return projects.map((p) => ({
    id: p.id,
    code: p.code,
    title: p.title,
    platform: p.platform,
    category: p.category,
    lifecycle: p.lifecycle,
    allocationStatus: p.allocationStatus,
    taskCount: p._count.workItems,
    flagged: p.flags.length > 0,
    lastFlag: p.flags[0] || null,
    isAllocated: p.allocations.some((a) => a.userId === user.id),
  }));
}

async function flagProject(projectId, user, note) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found", 404, "NOT_FOUND");

  await prisma.projectFlag.create({
    data: { projectId, userId: user.id, note },
  });

  await logActivity({
    type: "PROJECT_FLAGGED",
    message: `${user.name} flagged project ${project.code}${note ? `: ${note}` : ""}`,
    actorId: user.id,
    entityId: project.id,
    entityType: "project",
  });

  const pl = await prisma.user.findFirst({ where: { role: "PROJECT_LEAD", isActive: true } });
  if (pl) {
    await notifyUser(pl.id, {
      title: "Project flagged",
      message: `${user.name} flagged ${project.code}`,
      type: "PROJECT_FLAGGED",
      link: "/projects",
    });
  }

  return { message: "Flagged to Project Lead", projectId };
}

async function requestProject(user, data) {
  const code = `req-${Date.now()}`;
  return prisma.project.create({
    data: {
      code,
      title: data.title || "Requested project",
      platform: data.platform || user.platform,
      category: data.category,
      lifecycle: "LIVE",
      allocationStatus: "PENDING",
      allocations: { create: [{ userId: user.id }] },
    },
  });
}

async function createProject(user, data) {
  const code = `PRJ-${Date.now().toString().slice(-6)}`;
  return prisma.project.create({
    data: {
      code,
      title: data.title || "New Project",
      platform: data.platform || user.platform,
      category: data.description || data.category,
      lifecycle: data.status || "LIVE",
      allocationStatus: "ALLOCATED",
      allocations: { create: [{ userId: user.id }] },
    },
  });
}

async function getProjectById(id) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      allocations: { include: { user: { select: { id: true, name: true } } } },
    },
  });
  if (!project) throw new AppError("Project not found", 404, "NOT_FOUND");
  return project;
}

module.exports = { listProjects, flagProject, requestProject, createProject, getProjectById };
