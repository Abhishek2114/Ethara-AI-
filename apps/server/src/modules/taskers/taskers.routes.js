const { Router } = require("express");
const taskersController = require("./taskers.controller");
const { authenticate, authorizeRoles } = require("../../middleware");
const { ROLES } = require("../../config/constants");

const router = Router();
router.use(authenticate);
router.get(
  "/",
  authorizeRoles(ROLES.QUALITY_REVIEWER, ROLES.PROJECT_LEAD, ROLES.ADMIN),
  taskersController.list
);

module.exports = router;
