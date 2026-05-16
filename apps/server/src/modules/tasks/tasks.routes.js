const { Router } = require("express");
const tasksController = require("./tasks.controller");
const { createValidator, updateValidator, reorderValidator } = require("./tasks.validators");
const { authenticate, validate } = require("../../middleware");

const router = Router();

router.use(authenticate);
router.get("/", tasksController.list);
router.post("/reorder", reorderValidator, validate, tasksController.reorder);
router.get("/:id", tasksController.getOne);
router.post("/", createValidator, validate, tasksController.create);
router.put("/:id", updateValidator, validate, tasksController.update);
router.delete("/:id", tasksController.remove);

module.exports = router;
