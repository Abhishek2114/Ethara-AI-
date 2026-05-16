const { Router } = require("express");
const healthController = require("./health.controller");

const router = Router();

router.get("/", healthController.getHealth);
router.get("/ready", healthController.getReadiness);

module.exports = router;
