const { Router } = require("express");
const analyticsController = require("./analytics.controller");
const { authenticate } = require("../../middleware");

const router = Router();
router.use(authenticate);
router.get("/team", analyticsController.team);

module.exports = router;
