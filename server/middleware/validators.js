const { body } = require("express-validator");

const validators = {
  card: [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().optional(),
    body("columnId").isInt().withMessage("Valid column ID is required"),
    body("tagId").optional().isInt().withMessage("Tag ID must be an integer"),
  ],

  tag: [
    body("name").trim().notEmpty().withMessage("Tag name is required"),
    body("color")
      .trim()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage("Valid color hex code is required"),
  ],

  position: [
    body("newPosition").isInt().withMessage("New position must be an integer"),
    body("oldPosition").isInt().withMessage("Old position must be an integer"),
    body("columnId").isInt().withMessage("Column ID must be an integer"),
  ],
};

module.exports = validators;
