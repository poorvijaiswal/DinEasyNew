const express = require('express');
const db = require('../config/db');
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Profile route (to fetch user data)
app.get("/api/profile", (req, res) => {
  // Assuming you have a 'users' table with 'id', 'name', 'email', and 'phone' columns
  const userId = 1; // Example user id, replace with dynamic logic if needed
  db.query(
    "SELECT name, email, phone FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ message: "Error fetching data" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
    }
  );
});
