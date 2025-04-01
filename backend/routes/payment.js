const express = require('express');
const Razorpay = require('razorpay');
const crypto = require("crypto");
const QRCode = require("qrcode");
const db = require('../config/db');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint: Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
  const { membershipId, price } = req.body;

  const options = {
    amount: price * 100, // Amount in paise
    currency: 'INR',
    receipt: `receipt_${membershipId}_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    // res.json(order);
    res.json({ id: order.id, amount: order.amount }); // Ensure the response includes the order ID and amount
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error });
  }
});

// Endpoint: Process Membership Payment
router.post('/membership', (req, res) => {
  const { membership_id, amount, payment_method, payment_id, order_id } = req.body;

  // Insert a payment record
  const sql = "INSERT INTO Payment (order_id, payment_date, amount, payment_method, status) VALUES (?, NOW(), ?, ?, 'Paid')";
  db.query(sql, [order_id, amount, payment_method], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // Optionally, update Membership to mark as active/payment completed
    const updateMembershipSql = "UPDATE Membership SET status = 'Active', payment_id = ? WHERE membership_id = ?";
    db.query(updateMembershipSql, [result.insertId, membership_id], (err, updateResult) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Membership payment successful", payment_id: result.insertId });
    });
  });
});

// Endpoint: Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error });
  }
});

// Endpoint: Verify Payment and Create Preorder
// Endpoint: Verify Payment and Create Preorder
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, restaurant_id, customer_id, items, amount } =
    req.body;

  // Verify Razorpay signature
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  // Calculate dynamic estimated wait time
  const averagePreparationTime = 5; // Average preparation time per order in minutes
  const queueLengthSql = `
    SELECT COUNT(*) AS queueLength 
    FROM Preorders 
    WHERE restaurant_id = ? AND status = 'Pending'
  `;

  db.query(queueLengthSql, [restaurant_id], (err, queueResult) => {
    if (err) {
      console.error("Error calculating queue length:", err);
      return res.status(500).json({ message: "Error calculating queue length", error: err });
    }

    const queueLength = queueResult[0].queueLength;
    const estimatedWaitTime = queueLength * averagePreparationTime;

    // Insert preorder into the database
    const preorderSql = `
      INSERT INTO Preorders (restaurant_id, customer_id, items, status, estimated_wait_time)
      VALUES (?, ?, ?, 'Pending', ?)
    `;
    db.query(preorderSql, [restaurant_id, customer_id, JSON.stringify(items), estimatedWaitTime], (err, preorderResult) => {
      if (err) {
        console.error("Error creating preorder:", err);
        return res.status(500).json({ message: "Error creating preorder", error: err });
      }

      const preorderId = preorderResult.insertId;

      // Insert payment record into PreorderPayment table
      const paymentSql = `
        INSERT INTO PreorderPayment (preorder_id, payment_id, amount, payment_method, status)
        VALUES (?, ?, ?, 'Razorpay', 'Success')
      `;
      db.query(paymentSql, [preorderId, razorpay_payment_id, amount], (err) => {
        if (err) {
          console.error("Error inserting payment record:", err);
          return res.status(500).json({ message: "Error inserting payment record", error: err });
        }

        res.status(200).json({
          message: "Payment verified and preorder created successfully",
          preorderId,
          estimatedWaitTime,
        });
      });
    });
  });
});


// Endpoint: Generate QR Code
router.get("/generate-qrcode/:preorderId", async (req, res) => {
  const { preorderId } = req.params;

  try {
    const qrCodeData = `http://localhost:5000/api/payment/generate-qrcode/${preorderId}`; // URL to view the bill
    const qrCode = await QRCode.toDataURL(qrCodeData);

    res.status(200).json({ qrCode });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ message: "Error generating QR code", error });
  }
});

// Endpoint: Mark Order as Complete
router.post("/mark-complete", (req, res) => {
  const { preorderId } = req.body;

  const updateSql = `
    UPDATE Preorders
    SET status = 'Completed'
    WHERE preorder_id = ?
  `;

  db.query(updateSql, [preorderId], (err, result) => {
    if (err) {
      console.error("Error marking order as complete:", err);
      return res.status(500).json({ message: "Error marking order as complete", error: err });
    }

    res.status(200).json({ message: "Order marked as complete successfully" });
  });
});


module.exports = router;