const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Endpoint: Process Membership Payment
// Expected request body: { membership_id, amount, payment_method } 
router.post('/membership', (req, res) => {
    const { membership_id, amount, payment_method } = req.body;
    // Here, you might integrate a payment gateway.
    // For simulation, we'll assume the payment is successful.
    
    // Insert a payment record (assuming order_id is not applicable for membership, you might use membership_id or a special flag)
    const sql = "INSERT INTO Payment (order_id, payment_date, amount, payment_method, status) VALUES (?, NOW(), ?, ?, 'Paid')";
    // For membership payments, we can set order_id = 0 or use a dedicated column if needed.
    db.query(sql, [0, amount, payment_method], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        
        // Optionally, update Membership to mark as active/payment completed.
        res.json({ message: "Membership payment successful", payment_id: result.insertId });
    });
});

module.exports = router;
