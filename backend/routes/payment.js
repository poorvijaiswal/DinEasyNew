// const express = require('express');
// const db = require('../config/db');
// const router = express.Router();

// // Endpoint: Process Membership Payment
// // Expected request body: { membership_id, amount, payment_method } 
// router.post('/membership', (req, res) => {
//     const { membership_id, amount, payment_method } = req.body;
//     // Here, you might integrate a payment gateway.
//     // For simulation, we'll assume the payment is successful.
    
//     // Insert a payment record (assuming order_id is not applicable for membership, you might use membership_id or a special flag)
//     const sql = "INSERT INTO Payment (order_id, payment_date, amount, payment_method, status) VALUES (?, NOW(), ?, ?, 'Paid')";
//     // For membership payments, we can set order_id = 0 or use a dedicated column if needed.
//     db.query(sql, [0, amount, payment_method], (err, result) => {
//         if (err) return res.status(500).json({ error: err });
        
//         // Optionally, update Membership to mark as active/payment completed.
//         res.json({ message: "Membership payment successful", payment_id: result.insertId });
//     });
// });

// module.exports = router;


const express = require('express');
const Razorpay = require('razorpay');
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

module.exports = router;