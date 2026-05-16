const { body, param } = require("express-validator");

const createValidator = [
  body("title").trim().notEmpty().isLength({ max: 200 }),
  body("description").optional().trim(),
  body("projectId").notEmpty(),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("dueDate").optional().isISO8601(),
  body("assignedToId").optional().isString(),
];

const updateValidator = [
  param("id").notEmpty(),
  body("title").optional().trim().notEmpty(),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("order").optional().isInt({ min: 0 }),
];

const reorderValidator = [
  body("updates").isArray({ min: 1 }),
  body("updates.*.id").notEmpty(),
  body("updates.*.status").isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  body("updates.*.order").isInt({ min: 0 }),
];

module.exports = { createValidator, updateValidator, reorderValidator };
