const pool = require("../config/database");

class Card {
  static async findAll() {
    const result = await pool.query(
      `SELECT 
        c.*,
        CASE 
          WHEN t.id IS NOT NULL THEN 
            json_build_object(
              'id', t.id,
              'name', t.name,
              'color', t.color
            )
          ELSE NULL
        END as tag
      FROM cards c 
      LEFT JOIN tags t ON c.tag_id = t.id 
      ORDER BY c.column_id, c.position ASC`
    );
    return result.rows;
  }

  static async findOne(id) {
    const result = await pool.query(
      `SELECT 
        c.*,
        CASE 
          WHEN t.id IS NOT NULL THEN 
            json_build_object(
              'id', t.id,
              'name', t.name,
              'color', t.color
            )
          ELSE NULL
        END as tag
      FROM cards c 
      LEFT JOIN tags t ON c.tag_id = t.id 
      WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { title, description, columnId, tagId } = data;

      const posResult = await client.query(
        "SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM cards WHERE column_id = $1",
        [columnId]
      );
      const position = posResult.rows[0].next_pos;

      const result = await client.query(
        `INSERT INTO cards (title, description, column_id, tag_id, position) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [title, description, columnId, tagId, position]
      );

      const cardWithTag = await client.query(
        `SELECT 
          c.*,
          CASE 
            WHEN t.id IS NOT NULL THEN 
              json_build_object(
                'id', t.id,
                'name', t.name,
                'color', t.color
              )
            ELSE NULL
          END as tag
        FROM cards c 
        LEFT JOIN tags t ON c.tag_id = t.id 
        WHERE c.id = $1`,
        [result.rows[0].id]
      );

      await client.query("COMMIT");
      return cardWithTag.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePosition(cardId, newPosition, columnId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const currentCard = await client.query(
        "SELECT position, column_id FROM cards WHERE id = $1",
        [cardId]
      );

      if (currentCard.rows.length === 0) {
        throw new Error("Card not found");
      }

      const oldPosition = currentCard.rows[0].position;
      const oldColumnId = currentCard.rows[0].column_id;

      if (parseInt(oldColumnId) === parseInt(columnId)) {
        if (oldPosition < newPosition) {
          await client.query(
            `UPDATE cards 
             SET position = position - 1 
             WHERE column_id = $1 
             AND position > $2 
             AND position <= $3`,
            [columnId, oldPosition, newPosition]
          );
        } else {
          await client.query(
            `UPDATE cards 
             SET position = position + 1 
             WHERE column_id = $1 
             AND position >= $2 
             AND position < $3`,
            [columnId, newPosition, oldPosition]
          );
        }
      } else {
        await client.query(
          `UPDATE cards 
           SET position = position - 1 
           WHERE column_id = $1 
           AND position > $2`,
          [oldColumnId, oldPosition]
        );

        await client.query(
          `UPDATE cards 
           SET position = position + 1 
           WHERE column_id = $1 
           AND position >= $2`,
          [columnId, newPosition]
        );
      }

      await client.query(
        `UPDATE cards 
         SET position = $1, column_id = $2 
         WHERE id = $3`,
        [newPosition, columnId, cardId]
      );

      const result = await client.query(
        `WITH normalized_positions AS (
          SELECT id, 
                 ROW_NUMBER() OVER (
                   PARTITION BY column_id 
                   ORDER BY position
                 ) - 1 as new_position
          FROM cards
          WHERE column_id = $1
        )
        UPDATE cards c
        SET position = np.new_position
        FROM normalized_positions np
        WHERE c.id = np.id
        RETURNING c.*`,
        [columnId]
      );

      const finalCard = await client.query(
        `SELECT 
          c.*,
          CASE 
            WHEN t.id IS NOT NULL THEN 
              json_build_object(
                'id', t.id,
                'name', t.name,
                'color', t.color
              )
            ELSE NULL
          END as tag
        FROM cards c 
        LEFT JOIN tags t ON c.tag_id = t.id 
        WHERE c.id = $1`,
        [cardId]
      );

      await client.query("COMMIT");
      return finalCard.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cardResult = await client.query(
        "SELECT position, column_id FROM cards WHERE id = $1",
        [id]
      );

      if (cardResult.rows.length === 0) {
        throw new Error("Card not found");
      }

      const { position, column_id } = cardResult.rows[0];

      const result = await client.query(
        "DELETE FROM cards WHERE id = $1 RETURNING *",
        [id]
      );

      await client.query(
        `UPDATE cards 
        SET position = position - 1 
        WHERE column_id = $1 
        AND position > $2`,
        [column_id, position]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Card;
