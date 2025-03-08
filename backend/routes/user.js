const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db.js");

const router = express.Router();

//  Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//  Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create User Route (Example)
// router.post("/create-user", (req, res) => {
//   const { email, password, phone, owner_name, membership_type, start_date, end_date } = req.body;
//   const defaultProfileImage = "default-profile.png"; // Default profile image

//   const query = "INSERT INTO users (email, password, phone, owner_name, membership_type, start_date, end_date, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//   db.query(query, [email, password, phone, owner_name, membership_type, start_date, end_date, defaultProfileImage], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "User created successfully", userId: result.insertId });
//   });
// });

//  Update Profile Route
router.post("/update-profile/:membershipId", upload.single("profileImage"), (req, res) => {
  const membershipId = req.params.id;

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = req.file.filename; // Save filename in DB

console.log("File uploaded:", imagePath);
const query = "UPDATE users SET profile_image = ? WHERE membership_id = ?";
  
  db.query(query, [imagePath, membershipId], (err, result) => {
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

    res.json(results[0]);
  });
});
module.exports = router;
