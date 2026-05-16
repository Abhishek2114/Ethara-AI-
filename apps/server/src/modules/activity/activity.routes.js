const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { catchAsync, sendSuccess } = require("../../core/http");
const { listActivities } = require("../../shared/services/activity.service");

const router = Router();
router.use(authenticate);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const activities = await listActivities(req.user, {
      limit: parseInt(req.query.limit, 10) || 30,
    });
    sendSuccess(res, { activities });
  })
);

module.exports = router;
