const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db.js");

const router = express.Router();

// Serve uploaded images
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
const upload = multer({ storage });


// Insert or Update Profile Image with URL, CreatedAt, and UpdatedAt
router.post("/update-profile/:membershipId", upload.single("profileImage"), (req, res) => {
    const { membershipId } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Storing only relative path

    const query = `
        INSERT INTO users (profile_image, membership_id, created_at, updated_at) 
        VALUES (?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE profile_image = ?, updated_at = NOW();
    `;

    db.query(query, [imageUrl, membershipId, imageUrl], (err, result) => {
        if (err) {
            console.error("Error inserting/updating profile image:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        res.json({ message: "Profile image updated successfully", profile_image: imageUrl });
    });
});

// Get user data by membership ID
router.get('/:membershipId', (req, res) => {
  const { membershipId } = req.params;

  db.query('SELECT * FROM membership WHERE membership_id = ?', [membershipId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      console.log("Fetched User Data from DB:", results[0]); // Debugging
      res.json(results[0]); // Ensure we return the correct user data
  });
});
module.exports = router;
