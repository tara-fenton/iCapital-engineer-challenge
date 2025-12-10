const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("investors.db");

const execute = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = { db, execute };