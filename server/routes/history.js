const express = require("express");
const router = express.Router();
const HistoryLog = require("../models/HistoryLog");
const helpers = require("../utils/helpers");

router.get("/", async (req, res) => {
  try {
    const logs = await HistoryLog.findAll();
    res.json(logs);
  } catch (error) {
    helpers.handleError(res, error);
  }
});

router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const logs = await HistoryLog.findByDate(date);
    res.json(logs);
  } catch (error) {
    helpers.handleError(res, error);
  }
});

module.exports = router;
