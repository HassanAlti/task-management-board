const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const Tag = require("../models/Tag");
const validators = require("../middleware/validators");
const helpers = require("../utils/helpers");

module.exports = () => {
  router.get("/", async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  router.post("/", validators.tag, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tag = await Tag.create(req.body);
      console.log("TAG CREATED", tag);
      res.status(201).json(tag);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTag = await Tag.delete(id);

      if (!deletedTag) {
        return res.status(404).json({ error: "Tag not found" });
      }

      res.json(deletedTag);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  return router;
};
