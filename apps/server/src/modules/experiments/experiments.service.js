const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { logActivity } = require("../../shared/utils/activity");

async function listExperiments(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.modelId) where.modelId = filters.modelId;

  return prisma.experiment.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      model: { select: { id: true, name: true, version: true } },
      project: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

async function getExperiment(id) {
  const experiment = await prisma.experiment.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      model: true,
      project: { select: { id: true, title: true } },
    },
  });
  if (!experiment) throw new AppError("Experiment not found", 404, "NOT_FOUND");
  return experiment;
}

async function createExperiment(data, user) {
  const experiment = await prisma.experiment.create({
    data: {
      name: data.name,
      hypothesis: data.hypothesis,
      status: data.status || "PLANNED",
      metrics: data.metrics,
      modelId: data.modelId,
      projectId: data.projectId,
      createdById: user.id,
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      model: { select: { id: true, name: true, version: true } },
      project: { select: { id: true, title: true } },
    },
  });

  await logActivity({
    action: "started experiment",
    userId: user.id,
    projectId: data.projectId,
    metadata: { experiment: data.name },
  });

  return experiment;
}

async function updateExperiment(id, data) {
  return prisma.experiment.update({
    where: { id },
    data: {
      name: data.name,
      hypothesis: data.hypothesis,
      status: data.status,
      metrics: data.metrics,
      modelId: data.modelId,
      projectId: data.projectId,
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      model: { select: { id: true, name: true, version: true } },
      project: { select: { id: true, title: true } },
    },
  });
}

async function deleteExperiment(id) {
  await prisma.experiment.delete({ where: { id } });
}

module.exports = {
  listExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  deleteExperiment,
};
