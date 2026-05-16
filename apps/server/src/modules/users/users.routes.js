const { Router } = require("express");
const usersController = require("./users.controller");
const { authenticate } = require("../../middleware");

const router = Router();

router.patch("/me", authenticate, usersController.updateMe);
router.patch("/me/password", authenticate, usersController.updatePassword);

module.exports = router;
