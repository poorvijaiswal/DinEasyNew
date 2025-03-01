const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db.js");

const router = express.Router();

// Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Update Profile Route
router.post("/update-profile/:id", upload.single("profileImage"), (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = req.file.filename; // Save filename in DB
  console.log("File uploaded:", imagePath);

  const query = "UPDATE users SET profile_image = ? WHERE id = ?";
  db.query(query, [imagePath, userId], (err, result) => {
    if (err) {
      console.error("Error updating profile image in DB:", err);
      return res.status(500).json({ error: err });
    }
    console.log("Profile updated successfully in DB");
    console.log("Query executed:", query);
    console.log("Data passed:", [imagePath, userId]);
    res.json({ message: "Profile updated successfully", profile_image: imagePath });
  });
});

// Fetch User Data Route
router.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT users.*, membership.owner_name, membership.email
    FROM users
    JOIN membership ON users.membership_id = membership.membership_id
    WHERE users.id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  });
});

module.exports = router;