const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/token - Create a new food token
router.post("/token", (req, res) => {
  const { restaurant_id, food_item, quantity, unit, pickup_location, expiry_time } = req.body;

  const sql = `
    INSERT INTO food_tokens 
    (restaurant_id, food_item, quantity, unit, pickup_location, expiry_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [restaurant_id, food_item, quantity, unit, pickup_location, expiry_time],
    (err, result) => {
      if (err) {
        console.error(" Error inserting token:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "✅ Token created successfully!" });
    }
  );
});

module.exports = router;
