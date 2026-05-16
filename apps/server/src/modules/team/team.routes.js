const { Router } = require("express");
const teamController = require("./team.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.get("/", authenticate, teamController.list);

module.exports = router;
