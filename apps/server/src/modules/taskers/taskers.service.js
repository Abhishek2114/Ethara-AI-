const prisma = require("../../core/database/prisma");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function listTaskers(user) {
  const ids = await getTaskerIdsForReviewer(user);
  const today = startOfDay();

  const taskers = await prisma.user.findMany({
    where: { id: { in: ids }, role: "TASKER" },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      jobTitle: true,
      platform: true,
      allocations: { include: { project: true } },
      attendance: { where: { date: today }, take: 1 },
      workItems: true,
    },
    orderBy: { name: "asc" },
  });

  return taskers.map((t) => {
    const total = t.workItems.length;
    const completed = t.workItems.filter((w) => w.status === "COMPLETED").length;
    const todayDone = t.workItems.filter(
      (w) => w.completedAt && startOfDay(w.completedAt).getTime() === today.getTime()
    ).length;
    const qualityItems = t.workItems.filter((w) => w.qualityScore != null);
    const avgQuality =
      qualityItems.length > 0
        ? Math.round(
            (qualityItems.reduce((s, w) => s + w.qualityScore, 0) / qualityItems.length) * 100
          )
        : null;
    const ahtItems = t.workItems.filter((w) => w.handleTimeMinutes != null);
    const avgAht =
      ahtItems.length > 0
        ? Math.round(ahtItems.reduce((s, w) => s + w.handleTimeMinutes, 0) / ahtItems.length)
        : null;

    return {
      id: t.id,
      name: t.name,
      email: t.email,
      avatar: t.avatar,
      jobTitle: t.jobTitle,
      status: t.attendance[0]?.status || "ABSENT",
      project: t.allocations[0]?.project?.code || null,
      tasksTotal: total,
      completed,
      today: todayDone,
      quality: avgQuality,
      aht: avgAht,
      completion: total ? Math.round((completed / total) * 100) : 0,
    };
  });
}

module.exports = { listTaskers };
