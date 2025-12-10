const { exec } = require("./sql");

const initDb = async () => {
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS investors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        phone TEXT NOT NULL,
        street TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT
      );
    `);

    await exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investor_id INTEGER NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        stored_path TEXT NOT NULL,
        created_at TEXT,
        FOREIGN KEY (investor_id) REFERENCES investors(id)
      );
    `);

    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = { initDb };