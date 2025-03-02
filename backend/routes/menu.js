const express = require("express");
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// ✅ API to Add Menu Item (Fixed category_id issue)
router.post("/menu", upload.single("image"), (req, res) => {
    const { restaurant_id, category, name, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;

    // Check for missing fields
    if (!restaurant_id || !category || !name || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Insert query (category instead of category_id)
    const query = "INSERT INTO Menu (restaurant_id, category, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [restaurant_id, category, name, description, price, image_url], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ message: "Menu item added successfully!", id: result.insertId });
    });
});

module.exports = router;
