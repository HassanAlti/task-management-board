const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const Card = require("../models/Card");
const HistoryLog = require("../models/HistoryLog");
const validators = require("../middleware/validators");
const helpers = require("../utils/helpers");

module.exports = () => {
  router.get("/", async (req, res) => {
    try {
      const cards = await Card.findAll();
      res.json(cards);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  router.post("/", validators.card, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const card = await Card.create(req.body);

      const completeCard = await Card.findOne(card.id);

      await HistoryLog.create({
        cardId: card.id,
        actionType: "create",
        details: { message: `Card ${card.title} was created` },
      });

      res.status(201).json(completeCard);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  router.put("/:id/position", validators.position, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { newPosition, oldPosition, columnId, sourceColumnId } = req.body;

      const updatedCard = await Card.updatePosition(id, newPosition, columnId);

      const logDetails = {
        columnId,
        sourceColumnId,
      };

      if (columnId === sourceColumnId) {
        logDetails.direction = newPosition > oldPosition ? "down" : "up";
        console.log("NEW POSITION", newPosition);
        console.log("Old POSITION", oldPosition);
        console.log(logDetails.direction);
      }

      await HistoryLog.create({
        cardId: id,
        actionType:
          columnId !== sourceColumnId ? "move_column" : "move_position",
        details: logDetails,
      });

      res.json(updatedCard);
    } catch (error) {
      helpers.handleError(res, error);
    }
  });

  return router;
};
