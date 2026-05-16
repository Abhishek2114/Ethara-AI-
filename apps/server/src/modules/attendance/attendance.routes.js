const { Router } = require("express");
const attendanceController = require("./attendance.controller");
const { authenticate } = require("../../middleware");

const router = Router();
router.use(authenticate);
router.get("/", attendanceController.list);
router.post("/check-in", attendanceController.checkIn);

module.exports = router;
