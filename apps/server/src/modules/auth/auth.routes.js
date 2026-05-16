const { Router } = require("express");
const authController = require("./auth.controller");
const { registerValidator, loginValidator } = require("./auth.validators");
const {
  authenticate,
  validate,
  createAuthRateLimiter,
} = require("../../middleware");

const router = Router();
const authLimiter = createAuthRateLimiter();

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  authController.register
);
router.post("/login", authLimiter, loginValidator, validate, authController.login);
router.post("/refresh", authLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.get("/me", authenticate, authController.me);
router.get("/reviewers", authController.reviewers);

module.exports = router;
