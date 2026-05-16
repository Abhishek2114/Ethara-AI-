const { body } = require("express-validator");
const { ROLES } = require("../../config/constants");

const registerValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/),
  body("name").trim().notEmpty().isLength({ max: 100 }),
  body("role").optional().isIn(Object.values(ROLES)),
  body("jobTitle").optional().trim().isLength({ max: 120 }),
  body("qualityReviewerId").optional().isString(),
];

const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

module.exports = { registerValidator, loginValidator };
