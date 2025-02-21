const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db"); // Ensure the correct database connection

const router = express.Router();

// ✅ Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Update Profile Route
router.post("/update-profile/:id", upload.single("profileImage"), (req, res) => {
  const userId = req.params.id;

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imagePath = req.file.filename; // Save filename in DB
  const query = "UPDATE users SET profile_image = ? WHERE id = ?";
  db.query(query, [imagePath, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Profile updated successfully", profile_image: imagePath });
  });
});

module.exports = router;
