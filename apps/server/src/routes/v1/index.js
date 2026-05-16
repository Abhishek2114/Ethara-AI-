const { Router } = require("express");
const { authRoutes } = require("../../modules/auth");
const { healthRoutes } = require("../../modules/health");
const dashboardRoutes = require("../../modules/dashboard/dashboard.routes");
const projectsRoutes = require("../../modules/projects/projects.routes");
const leaveRoutes = require("../../modules/leave/leave.routes");
const attendanceRoutes = require("../../modules/attendance/attendance.routes");
const taskersRoutes = require("../../modules/taskers/taskers.routes");
const analyticsRoutes = require("../../modules/analytics/analytics.routes");
const notificationsRoutes = require("../../modules/notifications/notifications.routes");
const workItemsRoutes = require("../../modules/work-items/work-items.routes");
const inboxRoutes = require("../../modules/inbox/inbox.routes");
const activityRoutes = require("../../modules/activity/activity.routes");
const { aiRoutes } = require("../../modules/ai");

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/projects", projectsRoutes);
router.use("/leave", leaveRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/taskers", taskersRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/work-items", workItemsRoutes);
router.use("/inbox", inboxRoutes);
router.use("/activity", activityRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
