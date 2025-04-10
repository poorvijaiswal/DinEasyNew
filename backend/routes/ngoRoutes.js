const express = require("express");
const router = express.Router();
const { registerNgo, loginNgo } = require("../controllers/ngoController");

// NGO Registration Route
router.post("/register", registerNgo);

// NGO Login Route
router.post("/login", loginNgo);

module.exports = router;