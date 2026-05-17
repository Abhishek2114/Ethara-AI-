const prisma = require("../../core/database/prisma");
const { getTaskerIdsForReviewer } = require("../dashboard/dashboard.service");
const { logActivity } = require("../../shared/services/activity.service");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/**
 * Auto-update attendance status based on check-in/out times
 * If no check-out by end of day, mark as IDLE
 */
async function updateAttendanceStatus() {
  const today = startOfDay();
  const now = new Date();

  // Find all attendance records for today with PRESENT status but no check-out
  const presentRecords = await prisma.attendance.findMany({
    where: {
      date: today,
      status: "PRESENT",
      checkOut: null,
    },
  });

  // Update records - if no check-out by end of work hours (e.g., 6 PM), mark as IDLE
  const WORK_END_HOUR = 18; // 6 PM
  const currentHour = now.getHours();

  if (currentHour >= WORK_END_HOUR) {
    for (const record of presentRecords) {
      await prisma.attendance.update({
        where: { id: record.id },
        data: { status: "IDLE" },
      });
    }
  }

  return presentRecords.length;
}

/**
 * Auto-apply leave status to attendance
 * Check if user has approved leave for a given date
 */
async function applyLeaveToAttendance(userId, date) {
  const dayStart = startOfDay(new Date(date));
  const dayEnd = endOfDay(new Date(date));

  // Check for approved leave on this date
  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: {
      userId,
      status: "APPROVED",
      startDate: { lte: dayEnd },
      endDate: { gte: dayStart },
    },
  });

  if (leaveRequest) {
    // Update or create attendance with ON_LEAVE status
    return prisma.attendance.upsert({
      where: { userId_date: { userId, date: dayStart } },
      update: { status: "ON_LEAVE" },
      create: {
        userId,
        date: dayStart,
        status: "ON_LEAVE",
      },
    });
  }
}

/**
 * Initialize attendance for all active users for a specific date
 * Useful for daily batch processing
 */
async function initializeDailyAttendance(date = new Date()) {
  const dayStart = startOfDay(date);

  // Get all active users
  const activeUsers = await prisma.user.findMany({
    where: { isActive: true },
  });

  const results = [];

  for (const user of activeUsers) {
    // Check if attendance record exists
    const existing = await prisma.attendance.findUnique({
      where: { userId_date: { userId: user.id, date: dayStart } },
    });

    if (!existing) {
      // Check for approved leave
      const onLeave = await applyLeaveToAttendance(user.id, date);

      if (!onLeave) {
        // Create ABSENT record by default
        const record = await prisma.attendance.create({
          data: {
            userId: user.id,
            date: dayStart,
            status: "ABSENT",
          },
        });
        results.push(record);
      }
    }
  }

  return results;
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

// Haversine formula to calculate distance in meters between two coordinates
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function markPresent(user, locationData = {}) {
  const today = startOfDay();
  const checkInTime = new Date();
  const { latitude, longitude, isRemote, deviceDetails } = locationData;

  // AstralHQ Corporate office mock coordinates (Delhi central coordinates)
  const OFFICE_LAT = 28.6139;
  const OFFICE_LNG = 77.2090;
  const GEOFENCE_RADIUS_METERS = 300; // 300 meters limit

  let logMessage = `${user.name} checked in at ${checkInTime.toLocaleTimeString()}`;

  if (latitude && longitude) {
    const distance = getDistanceMeters(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
    const isWithinGeofence = distance <= GEOFENCE_RADIUS_METERS;

    if (!isWithinGeofence && !isRemote) {
      throw new Error(`Out of range. You are ${(distance / 1000).toFixed(2)}km from office HQ. Please declare a Remote Session.`);
    }

    if (isRemote) {
      logMessage = `${user.name} checked in REMOTELY at ${checkInTime.toLocaleTimeString()} (Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    } else {
      logMessage = `${user.name} checked in at ${checkInTime.toLocaleTimeString()} (HQ Geofence verified: ${distance.toFixed(0)}m away)`;
    }
  } else {
    if (!isRemote) {
      throw new Error("Location coordinates are required for check-in verification. Enable GPS or declare a Remote Session.");
    }
    logMessage = `${user.name} checked in REMOTELY (Location unverified/GPS disabled) at ${checkInTime.toLocaleTimeString()}`;
  }

  if (deviceDetails) {
    logMessage += ` using ${deviceDetails}`;
  }

  const record = await prisma.attendance.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: { status: "PRESENT", checkIn: checkInTime },
    create: { userId: user.id, date: today, status: "PRESENT", checkIn: checkInTime },
  });

  await logActivity({
    type: "CHECK_IN",
    message: logMessage,
    actorId: user.id,
    entityId: record.id,
    entityType: "attendance",
  });

  return record;
}

async function markCheckOut(user) {
  const today = startOfDay();
  const checkOutTime = new Date();

  // Ensure user has checked in first
  const record = await prisma.attendance.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });

  if (!record) {
    throw new Error("No attendance record found for today. Please check in first.");
  }

  if (record.status !== "PRESENT") {
    throw new Error("User is not marked as present today.");
  }

  const updated = await prisma.attendance.update({
    where: { userId_date: { userId: user.id, date: today } },
    data: { checkOut: checkOutTime },
  });

  await logActivity({
    type: "CHECK_IN", // Reuse for now, can create CHECK_OUT if needed
    message: `${user.name} checked out at ${checkOutTime.toLocaleTimeString()}`,
    actorId: user.id,
    entityId: updated.id,
    entityType: "attendance",
  });

  return updated;
}

async function getDailyReport(date = new Date()) {
  const dayStart = startOfDay(date);

  const attendance = await prisma.attendance.findMany({
    where: { date: dayStart },
    include: { user: { select: { id: true, name: true, jobTitle: true } } },
  });

  const summary = {
    date: dayStart,
    total: attendance.length,
    present: attendance.filter(a => a.status === "PRESENT").length,
    absent: attendance.filter(a => a.status === "ABSENT").length,
    onLeave: attendance.filter(a => a.status === "ON_LEAVE").length,
    idle: attendance.filter(a => a.status === "IDLE").length,
    details: attendance,
  };

  return summary;
}

async function getAttendanceHistory(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const start = startOfDay(startDate);

  return prisma.attendance.findMany({
    where: {
      userId,
      date: { gte: start },
    },
    orderBy: { date: "desc" },
  });
}

module.exports = {
  listAttendance,
  markPresent,
  markCheckOut,
  updateAttendanceStatus,
  applyLeaveToAttendance,
  initializeDailyAttendance,
  getDailyReport,
  getAttendanceHistory,
};