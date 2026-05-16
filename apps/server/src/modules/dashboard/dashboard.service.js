const prisma = require("../../core/database/prisma");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function getTaskerIdsForReviewer(user) {
  if (user.role === "ADMIN" || user.role === "PROJECT_LEAD") {
    return prisma.user.findMany({ where: { role: "TASKER" }, select: { id: true } }).then((u) => u.map((x) => x.id));
  }
  if (user.role === "QUALITY_REVIEWER") {
    return prisma.user.findMany({ where: { qualityReviewerId: user.id, role: "TASKER" }, select: { id: true } }).then((u) => u.map((x) => x.id));
  }
  return [user.id];
}

async function getStats(user) {
  const today = startOfDay();
  const taskerIds = await getTaskerIdsForReviewer(user);

  const [taskers, leavePending, projects, workItems, notifications] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: taskerIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        jobTitle: true,
        allocations: { include: { project: { select: { code: true, title: true } } }, take: 1 },
        attendance: { where: { date: today }, take: 1 },
        workItems: { where: { status: "COMPLETED" } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.leaveRequest.count({
      where:
        user.role === "TASKER"
          ? { userId: user.id, status: "PENDING" }
          : { userId: { in: taskerIds }, status: "PENDING" },
    }),
    prisma.project.count({ where: { lifecycle: "LIVE" } }),
    prisma.workItem.findMany({
      where: { userId: { in: taskerIds } },
      include: { project: { select: { code: true } } },
    }),
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const reportingTo = user.reportingToId
    ? await prisma.user.findUnique({ where: { id: user.reportingToId }, select: { name: true } })
    : null;

  const myTaskers = taskers.map((t) => {
    const att = t.attendance[0];
    const project = t.allocations[0]?.project;
    const total = t.workItems.length;
    const todayDone = t.workItems.filter(
      (w) => w.completedAt && startOfDay(w.completedAt).getTime() === today.getTime()
    ).length;
    return {
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      jobTitle: t.jobTitle,
      status: att?.status || "IDLE",
      project: project ? project.code : null,
      projectLabel: project ? "No project" : "No project",
      tasksCompleted: total,
      todayOutput: todayDone,
    };
  });

  const leaveRequests =
    user.role === "TASKER"
      ? await prisma.leaveRequest.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : await prisma.leaveRequest.findMany({
          where: { userId: { in: taskerIds }, status: "PENDING" },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        });

  const completed = workItems.filter((w) => w.status === "COMPLETED").length;
  const total = workItems.length;
  const todayOutput = workItems.filter(
    (w) => w.completedAt && startOfDay(w.completedAt).getTime() === today.getTime()
  ).length;
  const blockers = workItems.filter((w) => w.status === "BLOCKED").length;
  const qualityScores = workItems.filter((w) => w.qualityScore != null);
  const avgQuality =
    qualityScores.length > 0
      ? Math.round(
          (qualityScores.reduce((s, w) => s + w.qualityScore, 0) / qualityScores.length) * 100
        )
      : 0;

  return {
    role: user.role,
    title:
      user.role === "QUALITY_REVIEWER"
        ? "Quality Reviewer Dashboard"
        : user.role === "PROJECT_LEAD"
          ? "Project Lead Dashboard"
          : "My Dashboard",
    subtitle:
      user.role === "QUALITY_REVIEWER"
        ? `Reporting to: ${reportingTo?.name || "—"} · Managing ${taskerIds.length} taskers`
        : user.role === "TASKER"
          ? "Your tasks, attendance & leave"
          : "Team operations overview",
    kpis: {
      myTaskers: taskerIds.length,
      tasksReviewed: completed,
      leaveRequests: leavePending,
      activeProjects: projects,
    },
    analytics: {
      completionRate: total ? Math.round((completed / total) * 100) : 98,
      avgQuality,
      todayOutput,
      openBlockers: blockers,
    },
    myTaskers,
    leaveRequests,
    unreadNotifications: notifications.length,
    notifications,
  };
}

module.exports = { getStats, getTaskerIdsForReviewer };
