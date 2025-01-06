const helpers = {
  generateLogMessage(cardTitle, actionType, details) {
    switch (actionType) {
      case "move_column":
        return `"${cardTitle}" was moved to "${details.columnName}"`;
      case "move_position":
        return `"${cardTitle}" was moved ${details.direction} within the column "${details.columnName}"`;
      default:
        return `"${cardTitle}" was updated`;
    }
  },

  handleError(res, error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  },
};

module.exports = helpers;
