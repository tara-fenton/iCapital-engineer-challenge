const express = require("express");
const { initDb } = require("./db");
const { run } = require("./sql"); 

const PORT = 3000;
const app = express();

app.use(express.json());

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});

// form validation middleware
const validateForm = (req, res, next) => {
    const requiredFields = ['firstName', 'lastName', 'dob', 'phone', 'street', 'state', 'zip'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            // clean up uploaded files
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error("Error deleting file:", err);
                    });
                }
            }
            return res.status(400).json({ status: 'error', message: `Missing required field: ${field}` });
        }
    }
    next();
};

app.post("/api/investors", upload.array("files"), validateForm, async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        dob,
        phone,
        street,
        state,
        zip,
      } = req.body;

      const now = new Date().toISOString();

      // insert investor
      const investorResult = await run(
        `
        INSERT INTO investors
        (first_name, last_name, date_of_birth, phone, street, state, zip, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [firstName, lastName, dob, phone, street, state, zip, now, now]
      );

      const investorId = investorResult.lastID;

      // insert documents (one row per uploaded file)
      const files = req.files || [];

      for (const file of files) {
        await run(
          `
          INSERT INTO documents
          (investor_id, original_name, mime_type, size_bytes, stored_path, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            investorId,
            file.originalname,
            file.mimetype,
            file.size,
            file.path, // path in /uploads
            now,
          ]
        );
      }

      // response
      res.status(201).json({
        status: "success",
        investor_id: investorId,
        message: "Investor and documents saved successfully",
      });
    } catch (err) {
      console.error("DB Insert Error:", err);
      res.status(500).json({ status: "error", message: "Server error" });
    }
});

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
