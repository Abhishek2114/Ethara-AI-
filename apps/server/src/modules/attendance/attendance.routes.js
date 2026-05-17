const { Router } = require("express");
const attendanceController = require("./attendance.controller");
const { authenticate } = require("../../middleware");

const router = Router();
router.use(authenticate);

router.get("/", attendanceController.list);
router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.get("/history", attendanceController.history);
router.get("/report/daily", attendanceController.dailyReport);
router.post("/admin/auto-update", attendanceController.autoUpdate);
router.post("/admin/initialize-daily", attendanceController.initializeDaily);

module.exports = router;
