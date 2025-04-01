const express = require("express");
const db = require("../config/db");
const router = express.Router();

//  Get all staff members (with restaurant name)
router.get("/staff", (req, res) => {
    const query = `
        SELECT Staff.staff_id, Staff.name, Staff.role, Staff.email, 
               Restaurant.restaurant_id, Restaurant.name AS restaurant_name 
        FROM Staff 
        INNER JOIN Restaurant ON Staff.restaurant_id = Restaurant.restaurant_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

//  Get all restaurants (for dropdown selection in frontend)
router.get("/restaurants", (req, res) => {
    res.set('Cache-Control', 'no-store');
    const query = "SELECT restaurant_id, name FROM Restaurant";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
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

//  Update staff details
router.put("/staff/:staff_id", (req, res) => {
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

//  Delete a staff member
router.delete("/staff/:staff_id", (req, res) => {
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
