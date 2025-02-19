const express = require("express");
const multer = require("multer");
const db = require("../config/db");

const router = express.Router();

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🟢 API: Get User Profile
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0]);
  });
});

// 🟢 API: Update Profile Image
router.post("/upload/:id", upload.single("profileImage"), (req, res) => {
  const { id } = req.params;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!profileImage) return res.status(400).json({ error: "No file uploaded" });

  db.query(
    "UPDATE users SET profile_image = ? WHERE id = ?",
    [profileImage, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, profileImage });
    }
  );
});

module.exports = router;
