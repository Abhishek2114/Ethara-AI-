const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");
const { logActivity } = require("../../shared/utils/activity");

async function listModels() {
  return prisma.aIModel.findMany({
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      project: { select: { id: true, title: true } },
      _count: { select: { experiments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

async function getModel(id) {
  const model = await prisma.aIModel.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      project: { select: { id: true, title: true } },
      experiments: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!model) throw new AppError("Model not found", 404, "NOT_FOUND");
  return model;
}

async function createModel(data, user) {
  const model = await prisma.aIModel.create({
    data: {
      name: data.name,
      version: data.version,
      description: data.description,
      type: data.type || "LLM",
      status: data.status || "DEVELOPMENT",
      endpoint: data.endpoint,
      accuracy: data.accuracy,
      latencyMs: data.latencyMs,
      projectId: data.projectId,
      createdById: user.id,
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      project: { select: { id: true, title: true } },
    },
  });

  await logActivity({
    action: "registered AI model",
    userId: user.id,
    projectId: data.projectId,
    metadata: { model: `${data.name} v${data.version}` },
  });

  return model;
}

async function updateModel(id, data) {
  return prisma.aIModel.update({
    where: { id },
    data: {
      name: data.name,
      version: data.version,
      description: data.description,
      type: data.type,
      status: data.status,
      endpoint: data.endpoint,
      accuracy: data.accuracy,
      latencyMs: data.latencyMs,
      projectId: data.projectId,
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      project: { select: { id: true, title: true } },
    },
  });
}

async function deleteModel(id) {
  await prisma.aIModel.delete({ where: { id } });
}

module.exports = { listModels, getModel, createModel, updateModel, deleteModel };
