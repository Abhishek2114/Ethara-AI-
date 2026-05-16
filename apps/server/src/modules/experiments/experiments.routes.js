const { Router } = require("express");
const experimentsController = require("./experiments.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.use(authenticate);
router.get("/", experimentsController.list);
router.get("/:id", experimentsController.getOne);
router.post("/", experimentsController.create);
router.put("/:id", experimentsController.update);
router.delete("/:id", experimentsController.remove);

module.exports = router;
