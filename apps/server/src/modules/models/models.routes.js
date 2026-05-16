const { Router } = require("express");
const modelsController = require("./models.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.use(authenticate);
router.get("/", modelsController.list);
router.get("/:id", modelsController.getOne);
router.post("/", modelsController.create);
router.put("/:id", modelsController.update);
router.delete("/:id", modelsController.remove);

module.exports = router;
