const prisma = require("../../core/database/prisma");
const projectsService = require("../projects/projects.service");

async function listTeam(user) {
  if (user.role === "ADMIN") {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: { select: { tasks: true, memberships: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  const projectIds = await projectsService.getAccessibleProjectIds(user.id, user.role);
  const teammates = await prisma.projectMember.findMany({
    where: { projectId: { in: projectIds } },
    select: { userId: true },
    distinct: ["userId"],
  });

  const teammateIds = [...new Set([user.id, ...teammates.map((t) => t.userId)])];

  return prisma.user.findMany({
    where: { id: { in: teammateIds } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
      _count: { select: { tasks: true, memberships: true } },
    },
    orderBy: { name: "asc" },
  });
}

module.exports = { listTeam };
