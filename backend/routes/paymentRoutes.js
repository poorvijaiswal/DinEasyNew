const express = require("express");
const router = express.Router();
const { createPayment, updatePaymentStatus } = require("../controllers/paymentController");

// Route to create a new payment
router.post("/create", createPayment);

// Route to update payment status
router.put("/update-status", updatePaymentStatus);

module.exports = router;