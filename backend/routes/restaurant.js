const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Register a Restaurant
router.post('/register', (req, res) => {
    // Expecting membership_id (from Membership table), restaurant name, and address
    const { membership_id, name, address } = req.body;
    
    const sql = "INSERT INTO Restaurant (membership_id, name, address) VALUES (?, ?, ?)";
    db.query(sql, [membership_id, name, address], (err, result) => {
        if (err) {
            console.error("Error inserting restaurant:", err);
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "Restaurant registered successfully" });
    });
});

// Get All Restaurants
router.get('/', (req, res) => {
    const sql = "SELECT * FROM Restaurant";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error retrieving restaurants:", err);
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

module.exports = router;
