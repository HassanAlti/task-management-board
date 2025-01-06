const pool = require("../config/database");

class Tag {
  static async findAll() {
    const result = await pool.query("SELECT * FROM tags ORDER BY name");
    return result.rows;
  }

  static async create(data) {
    const { name, color } = data;
    const result = await pool.query(
      "INSERT INTO tags (name, color) VALUES ($1, $2) RETURNING *",
      [name, color]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM tags WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Tag;
