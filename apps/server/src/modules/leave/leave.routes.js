const { Router } = require("express");
const leaveController = require("./leave.controller");
const { authenticate } = require("../../middleware");

const router = Router();
router.use(authenticate);
router.get("/", leaveController.list);
router.post("/", leaveController.create);
router.patch("/:id/status", leaveController.updateStatus);

module.exports = router;
