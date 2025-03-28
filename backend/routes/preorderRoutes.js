const db = require("../config/db");
const express = require("express");
const { createPreorder, getPreordersByRestaurant } = require("../controllers/preorderController");
const router = express.Router();

router.post("/", createPreorder); // Create a preorder
router.get("/:restaurant_id", getPreordersByRestaurant); // Get preorders for a restaurant

// API to get queue length and estimated wait time
router.get("/queue/:restaurant_id", (req, res) => {
    const { restaurant_id } = req.params;
  
    // Query to get the number of pending preorders for the restaurant
    const sql = `
      SELECT COUNT(*) AS queueLength 
      FROM Preorders 
      WHERE restaurant_id = ? AND status = 'Pending'
    `;
  
    db.query(sql, [restaurant_id], (err, result) => {
      if (err) {
        console.error("Error fetching queue length:", err);
        return res.status(500).json({ message: "Error fetching queue length" });
      }
  
      const queueLength = result[0].queueLength;
      const averagePreparationTime = 5; // Example: 5 minutes per order
      const estimatedWaitTime = queueLength * averagePreparationTime;
  
      res.json({ queueLength, estimatedWaitTime });
    });
  });
  
module.exports = router;