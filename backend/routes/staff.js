const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Get restaurant_id based on authenticated user
router.get("/auth/getRestaurantId", verifyToken, (req, res) => {
    const ownerEmail = req.user.email; // Extract email from token

    if (!ownerEmail) {
        return res.status(401).json({ message: "Unauthorized: No user email found" });
    }
    const query = "SELECT restaurant_id FROM Restaurant WHERE owner_email = ?";
    db.query(query, [ownerEmail], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ restaurant_id: result[0].restaurant_id });
    });
});

// Get all staff members for a specific restaurant
router.get("/staff/:restaurantId", verifyToken, (req, res) => {
    const { restaurantId } = req.params;
    console.log("Restaurant ID from params:", restaurantId);
    console.log("User from token:", req.user);

    if (!restaurantId) {
        return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const query = `
        SELECT Staff.staff_id, Staff.name, Staff.role, Staff.email, 
               Restaurant.restaurant_id, Restaurant.name AS restaurant_name 
        FROM Staff 
        INNER JOIN Restaurant ON Staff.restaurant_id = Restaurant.restaurant_id
        WHERE Staff.restaurant_id = ?;
    `;

    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("Staff List:", results);
        res.json(results);
    });
});

//  Add a new staff member
router.post("/staff", (req, res) => {
    const { restaurant_id, name, role, email } = req.body;

    if (!restaurant_id || !name || !role || !email) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO Staff (restaurant_id, name, role, email) VALUES (?, ?, ?, ?)";
    db.query(query, [restaurant_id, name, role, email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "Staff added successfully!", staff_id: result.insertId });
    });
});

// Update staff details
router.put("/staff/:staff_id", verifyToken, (req, res) => {
    const { staff_id } = req.params;
    const { name, role, email } = req.body;

    const query = "UPDATE Staff SET name = ?, role = ?, email = ? WHERE staff_id = ?";
    db.query(query, [name, role, email, staff_id], (err) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Staff updated successfully!" });
    });
});

// Delete a staff member
router.delete("/staff/:staff_id", verifyToken, (req, res) => {
    const { staff_id } = req.params;

    const query = "DELETE FROM Staff WHERE staff_id = ?";
    db.query(query, [staff_id], (err) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Staff deleted successfully!" });
    });
});

module.exports = router;
