
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // adjust path if needed

// POST /api/feedback
router.post("/feedback", (req, res) => {
  const { customer_name, order_id, rating, comments } = req.body;

  // Check if order_id exists
  const checkOrder = `SELECT * FROM orders WHERE order_id = ?`;
  db.query(checkOrder, [order_id], (err, results) => {
    if (err) {
      console.error("Error checking order:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    // Proceed with inserting feedback
    const sql = `
      INSERT INTO feedback (customer_name, order_id, rating, comments)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [customer_name, order_id, rating, comments], (err, result) => {
      if (err) {
        console.error("Error inserting feedback:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "Feedback submitted successfully" });
    });
  });
});

module.exports = router;
/*const express = require("express");
const router = express.Router();
const db = require("../config/db"); // adjust path if needed

// POST /api/feedback
router.post("/feedback", (req, res) => {
  const { customer_name, order_id, rating, comments } = req.body;

  // Check if order_id exists
  const checkOrder = SELECT * FROM orders WHERE order_id = ?;
  db.query(checkOrder, [order_id], (err, results) => {
    if (err) {
      console.error("Error checking order:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    // Proceed with inserting feedback
    const sql = 
      INSERT INTO feedback (customer_name, order_id, rating, comments)
      VALUES (?, ?, ?, ?)
    ;

    db.query(sql, [customer_name, order_id, rating, comments], (err, result) => {
      if (err) {
        console.error("Error inserting feedback:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "Feedback submitted successfully" });
    });
  });
});

module.exports = router;*/