const prisma = require("../../core/database/prisma");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");
const { logActivity } = require("../../shared/services/activity.service");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function listAttendance(user, { date } = {}) {
  const day = date ? startOfDay(new Date(date)) : startOfDay();
  const where = { date: day };

  if (user.role === "TASKER") where.userId = user.id;
  else if (user.role === "QUALITY_REVIEWER") {
    const ids = await getTaskerIdsForReviewer(user);
    where.userId = { in: ids };
  }

  return prisma.attendance.findMany({
    where,
    include: { user: { select: { id: true, name: true, avatar: true, jobTitle: true } } },
    orderBy: { user: { name: "asc" } },
  });
}

async function markPresent(user) {
  const today = startOfDay();
  const record = await prisma.attendance.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: { status: "PRESENT", checkIn: new Date() },
    create: { userId: user.id, date: today, status: "PRESENT", checkIn: new Date() },
  });

  await logActivity({
    type: "CHECK_IN",
    message: `${user.name} checked in`,
    actorId: user.id,
    entityId: record.id,
    entityType: "attendance",
  });

  return record;
}

module.exports = { listAttendance, markPresent };
