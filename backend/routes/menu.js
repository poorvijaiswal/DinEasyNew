const express = require("express");
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/auth"); 

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.get("/auth/getRestaurantId", (req, res) => {
    const ownerEmail = req.user.email; // Assuming authentication middleware extracts email

    if (!ownerEmail) {
        return res.status(401).json({ message: "Unauthorized: No user email found" });
    }

    const query = "SELECT id FROM restaurants WHERE owner_email = ?";
    db.query(query, [ownerEmail], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ restaurant_id: result[0].id });
    });
});
//  Add Menu Item
router.post("/menu", upload.single("image"), (req, res) => {
    const { restaurant_id, category, name, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!restaurant_id || !category || !name || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO Menu (restaurant_id, category, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [restaurant_id, category, name, description, price, image_url], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ message: "Menu item added successfully!", id: result.insertId });
    });
});

//  Fetch Menu Items for a Restaurant
router.get("/menu/:restaurant_id", (req, res) => {
    const { restaurant_id } = req.params;
    
    if (!restaurant_id) {
        return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const query = "SELECT * FROM Menu WHERE restaurant_id = ?";
    db.query(query, [restaurant_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

//  Update Menu Item
router.put("/menu/:id", upload.single("image"), (req, res) => {
    const { category, name, description, price } = req.body;
    const { id } = req.params;
    const image_url = req.file ? req.file.filename : req.body.image_url; // Keep old image if not changed

    const query = "UPDATE Menu SET category = ?, name = ?, description = ?, price = ?, image_url = ? WHERE id = ?";
    db.query(query, [category, name, description, price, image_url, id], (err) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ message: "Menu item updated successfully!" });
    });
});

//  Delete Menu Item
router.delete("/menu/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM Menu WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ message: "Menu item deleted successfully!" });
    });
});

module.exports = router;