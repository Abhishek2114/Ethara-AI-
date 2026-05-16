const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware");
const controller = require("./work-items.controller");

const router = Router();

router.use(authenticate);
router.get("/", authorizeRoles("QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"), controller.list);
router.post("/", authorizeRoles("PROJECT_LEAD", "ADMIN"), controller.create);
router.get("/project/:projectId", controller.listProjectItems);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/review", authorizeRoles("QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"), controller.review);

module.exports = router;
