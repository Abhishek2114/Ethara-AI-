const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { catchAsync, sendSuccess } = require("../../core/http");
const inboxService = require("./inbox.service");

const router = Router();
router.use(authenticate);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const inbox = await inboxService.getInbox(req.user);
    sendSuccess(res, inbox);
  })
);

module.exports = router;
