const { body, param } = require("express-validator");

const createValidator = [
  body("title").trim().notEmpty().isLength({ max: 120 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("status").optional().isIn(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]),
  body("memberIds").optional().isArray(),
];

const updateValidator = [
  param("id").notEmpty(),
  body("title").optional().trim().notEmpty().isLength({ max: 120 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("status").optional().isIn(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]),
];

module.exports = { createValidator, updateValidator };
