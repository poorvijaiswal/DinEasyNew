const express = require("express");
const router = express.Router();
const { registerNgo, loginNgo, forgotPassword, resetPassword } = require("../controllers/ngoController");

// NGO Registration Route
router.post("/register", registerNgo);

// NGO Login Route
router.post("/login", loginNgo);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password/:token", resetPassword);


module.exports = router;