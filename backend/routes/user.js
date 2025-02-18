const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("./models/User"); // Assuming you have a User model
const app = express();

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

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve static files (profile images)

// API to fetch user profile data
app.get("/api/user/profile", async (req, res) => {
  try {
    // Assuming you have a method to fetch user data
    const user = await User.findById(req.user.id); // You would have some authentication middleware to set `req.user`
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data", err);
    res.status(500).json({ message: "Server error" });
  }
});

// API to update profile image
app.post("/api/user/update-profile", upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch logged-in user
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update profile image path
    const profileImagePath = `/uploads/${req.file.filename}`;
    user.profileImage = profileImagePath;

    await user.save();
    res.json({ message: "Profile image updated successfully", profileImage: profileImagePath });
  } catch (err) {
    console.error("Error updating profile", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sample user model (example, adjust as per your schema)
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profileImage: String,
  // Other fields as necessary
});
const User = mongoose.model("User", userSchema);

// Connect to MongoDB (replace with your MongoDB connection details)
mongoose.connect("mongodb://localhost:27017/your-database", { useNewUrlParser: true, useUnifiedTopology: true });

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
