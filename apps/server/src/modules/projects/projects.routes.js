const { Router } = require("express");
const projectsController = require("./projects.controller");
const { authenticate, authorizeRoles } = require("../../middleware");

const router = Router();
router.use(authenticate);
router.get("/", projectsController.list);
router.post("/", authorizeRoles("ADMIN", "PROJECT_LEAD"), projectsController.create);
router.post("/request", projectsController.request);
router.get("/:id", projectsController.getById);
router.post("/:id/flag", projectsController.flag);

module.exports = router;
