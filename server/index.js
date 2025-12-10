const express = require("express");
const { initDb } = require("./db");

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.post("/api/investors", (req, res) => {
  res.send("Data received!");
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
