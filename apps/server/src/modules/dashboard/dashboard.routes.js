const { Router } = require("express");
const dashboardController = require("./dashboard.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.get("/stats", authenticate, dashboardController.stats);

module.exports = router;
