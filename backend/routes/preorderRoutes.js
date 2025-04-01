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

  router.get("/:preorderId", (req, res) => {
    const { preorderId } = req.params;
  
    console.log("Preorder ID received:", preorderId); // Debugging log
  
    const sql = `
      SELECT *
      FROM Preorders
      WHERE preorder_id = ?
    `;
  
    console.log("SQL Query:", sql); // Debugging log
    console.log("Query Parameters:", [preorderId]); // Debugging log
  
    db.query(sql, [preorderId], (err, result) => {
      if (err) {
        console.error("Error fetching preorder details:", err);
        return res.status(500).json({ message: "Error fetching preorder details", error: err });
      }
  
      console.log("Query Result:", result); // Debugging log
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Preorder not found" });
      }
  
      res.status(200).json(result);
    });
  });

module.exports = router;