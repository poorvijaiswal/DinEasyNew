// --- Backend: Express API Routes ---
const express = require('express');
const router = express.Router();
const db = require("../config/db");

// Get pending food tokens
router.get("/food_tokens", (req, res) => {
    const query = "SELECT * FROM food_tokens WHERE status = 'pending' AND expiry_time > NOW()";
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching food tokens:", err);
        return res.status(500).json({ message: "Error fetching tokens" });
      }
      res.json(results);
    });
  });
  
// Respond to a food token (accept or decline)
router.post("/token_responses", (req, res) => {
    const { token_id, ngo_id, status, message } = req.body;

    console.log("Received body:", req.body); // For debugging

    // Validate required fields
    if (!["accepted", "declined"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    if (!token_id || !ngo_id) {
        return res.status(400).json({ message: "Missing token_id or ngo_id" });
    }

    const checkQuery = "SELECT * FROM token_responses WHERE token_id = ? AND ngo_id = ?";
    db.query(checkQuery, [token_id, ngo_id], (err, existingResponse) => {
        if (err) {
            return res.status(500).json({ message: "Error checking response" });
        }

        if (existingResponse.length > 0) {
            return res.status(409).json({ message: "Token already responded to by this NGO." });
        }

        const responseQuery = `
            INSERT INTO token_responses (token_id, ngo_id, status, message)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                status = VALUES(status), 
                message = VALUES(message)
        `;

        db.query(responseQuery, [token_id, ngo_id, status, message], (err) => {
            if (err) {
                console.error("Error executing responseQuery:", err);
                return res.status(500).json({ message: "Error saving response" });
            }

            const updateTokenQuery = "UPDATE food_tokens SET status = ? WHERE token_id = ?";
            db.query(updateTokenQuery, [status, token_id], (err) => {
                if (err) {
                    console.error("Error updating token status:", err);
                    return res.status(500).json({ message: "Error updating token status" });
                }

                res.status(200).json({ message: "Response recorded successfully." });
            });
        });
    });
});

module.exports = router;
