const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Place an Order
router.post('/place', (req, res) => {
    const { restaurant_id, table_no, items, total_price, payment_status } = req.body;
    const sql = "INSERT INTO orders (restaurant_id, table_no, items, total_price, payment_status) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [restaurant_id, table_no, JSON.stringify(items), total_price, payment_status], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: "Order placed successfully" });
    });
});

// Get Orders for a Restaurant
router.get('/:restaurant_id', (req, res) => {
    const sql = "SELECT * FROM orders WHERE restaurant_id = ?";
    db.query(sql, [req.params.restaurant_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

module.exports = router;
