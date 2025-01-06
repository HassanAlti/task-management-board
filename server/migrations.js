const pool = require("./config/database");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        column_id VARCHAR(255) NOT NULL,
        tag_id INTEGER REFERENCES tags(id),
        position INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS history_logs (
        id SERIAL PRIMARY KEY,
        card_id INTEGER REFERENCES cards(id),
        action_type VARCHAR(50) NOT NULL,
        details JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    // Close the pool after migration
    await pool.end();
  }
}

// Run the migration
createTables();
