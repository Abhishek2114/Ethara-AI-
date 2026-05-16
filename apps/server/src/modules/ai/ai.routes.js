const { Router } = require("express");
const aiController = require("./ai.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.use(authenticate);

router.get("/insights", aiController.getInsights);
router.post("/insights/generate", aiController.generateInsights);

module.exports = router;
