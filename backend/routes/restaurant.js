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


// Get restaurant data by membership ID
router.get('/:membershipId', (req, res) => {
    const { membershipId } = req.params;
  
    db.query('SELECT * FROM Restaurant WHERE membership_id = ?', [membershipId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      res.json(results[0]);
    });
  });
module.exports = router;
