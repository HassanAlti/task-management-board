const pool = require("../config/database");

class HistoryLog {
  static async create({ cardId, actionType, details }) {
    const result = await pool.query(
      `INSERT INTO history_logs (card_id, action_type, details, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [cardId, actionType, JSON.stringify(details)]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(`
      SELECT 
        hl.*,
        c.title as card_title,
        to_char(hl.created_at, 'YYYY-MM-DD') as date
      FROM history_logs hl
      JOIN cards c ON hl.card_id = c.id
      ORDER BY hl.created_at DESC
    `);
    return result.rows;
  }

  static async findByDate(date) {
    const result = await pool.query(
      `
      SELECT 
        hl.*,
        c.title as card_title,
        to_char(hl.created_at, 'YYYY-MM-DD') as date
      FROM history_logs hl
      JOIN cards c ON hl.card_id = c.id
      WHERE to_char(hl.created_at, 'YYYY-MM-DD') = $1
      ORDER BY hl.created_at DESC
    `,
      [date]
    );
    return result.rows;
  }
}

module.exports = HistoryLog;
