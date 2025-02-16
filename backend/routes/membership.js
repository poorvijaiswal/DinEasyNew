const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Endpoint: Choose Membership Plan
// Expected request body: { membership_id, duration } where duration is 3, 6, or 12 (months)
router.post('/choose', (req, res) => {
    const { membership_id, duration } = req.body;
    if (![3, 6, 12].includes(duration)) {
        return res.status(400).json({ message: 'Invalid membership duration' });
    }
    // Calculate start_date and end_date based on current date and duration
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setMonth(end_date.getMonth() + duration);
    
    const sql = "UPDATE Membership SET start_date = ?, end_date = ? WHERE membership_id = ?";
    db.query(sql, [start_date, end_date, membership_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Membership plan selected successfully", start_date, end_date });
    });
});

module.exports = router;
