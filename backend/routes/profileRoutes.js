const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db"); // Import database connection

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload Profile Image API
router.post("/upload", upload.single("profileImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const userId = req.body.userId; // Assuming user ID is sent
  const imagePath = `/uploads/${req.file.filename}`;

  try {
    await db.query("UPDATE users SET profile_image = ? WHERE id = ?", [
      imagePath,
      userId,
    ]);
    res.json({ message: "Profile image uploaded successfully", imagePath });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database update failed" });
  }
});

// Get Profile Image API
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.query("SELECT profile_image FROM users WHERE id = ?", [userId]);
    if (rows.length > 0) {
      res.json({ profileImage: rows[0].profile_image });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch profile image" });
  }
});

module.exports = router;
