const { Router } = require("express");
const prisma = require("../../core/database/prisma");
const { authenticate } = require("../../middleware");
const { catchAsync, sendSuccess } = require("../../core/http");

const router = Router();
router.use(authenticate);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const unread = await prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });
    sendSuccess(res, { notifications, unread });
  })
);

router.patch(
  "/:id/read",
  catchAsync(async (req, res) => {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { read: true },
    });
    sendSuccess(res, { message: "Marked read" });
  })
);

router.patch(
  "/read-all",
  catchAsync(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    sendSuccess(res, { message: "All marked read" });
  })
);

module.exports = router;
