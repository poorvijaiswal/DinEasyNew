const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
const router = express.Router();

// MySQL database connection (using pool from server.js)
const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "Tiger", // Replace with your MySQL password
  database: "restaurantmanagementsys", // Replace with your MySQL database name
});

// Set up Multer storage for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to prevent overwriting
  },
});

const upload = multer({ storage });

// API to fetch user profile data
router.get("/profile", (req, res) => {
  const userId = req.query.userId; // User ID passed in query params
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Fetch user data from MySQL database
  pool.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]); // Send user data as JSON response
  });
});

// API to update profile image
router.post("/update-profile", upload.single("profileImage"), (req, res) => {
  const userId = req.body.userId; // User ID passed in form data

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a profile image" });
  }

  const profileImagePath = `/uploads/${req.file.filename}`;

  // Update the profile image path in the MySQL database
  pool.query(
    "UPDATE users SET profileImage = ? WHERE id = ?",
    [profileImagePath, userId],
    (err, results) => {
      if (err) {
        console.error("Error updating profile image", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ message: "Profile image updated successfully", profileImage: profileImagePath });
    }
  );
});

module.exports = router;
