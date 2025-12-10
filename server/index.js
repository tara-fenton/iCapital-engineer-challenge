const express = require("express");
const { initDb } = require("./db");

const PORT = 3000;
const app = express();

app.use(express.json());

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

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

app.post("/api/investors", upload.array("files"), validateForm, (req, res) => {
    res.status(200).json({
        message: 'File and fields uploaded successfully',
        data: req.body,
        file: req.files
    })
});

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
