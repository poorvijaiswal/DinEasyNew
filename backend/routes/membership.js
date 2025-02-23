const express = require('express');
const db = require('../config/db');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID , // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET , // Replace with your Razorpay Key Secret
});

// Endpoint: Choose Membership Plan
router.post('/select-membership', (req, res) => {
    const { membership_id, duration } = req.body;
    if (![3, 6, 12].includes(duration)) {
        return res.status(400).json({ message: 'Invalid membership duration' });
    }

    // Determine membership type based on duration
    let membership_type;
    let price;
    switch (duration) {
        case 3:
            membership_type = 'Basic';
            price = 100; // Convert to paise
            break;
        case 6:
            membership_type = 'Standard';
            price = 200; // Convert to paise
            break;
        case 12:
            membership_type = 'Premium';
            price = 300; // Convert to paise
            break;
        default:
            return res.status(400).json({ message: 'Invalid membership duration' });
    }

    console.log(`Selected Membership: ${membership_type}, Price: ${price}`);

    // Calculate start_date and end_date based on current date and duration
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setMonth(end_date.getMonth() + duration);
    
    const sql = "UPDATE Membership SET start_date = ?, end_date = ?, membership_type = ? WHERE membership_id = ?";
    db.query(sql, [start_date, end_date, membership_type, membership_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Membership plan selected successfully", start_date, end_date, membership_type, price });
    });
});

// Endpoint: Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
    const { amount } = req.body;
    console.log(`Amount received for order creation: ${amount}`);
    try {
        const options = {
            amount: amount, // Amount is already in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        console.log(`Creating Razorpay order with options:`, options);
        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id, amount: options.amount });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Update Membership after successful payment
router.post('/update-membership', (req, res) => {
    const { membership_id, duration, payment_id, order_id } = req.body;

    console.log(`Updating membership for payment_id: ${payment_id}, order_id: ${order_id}`);

    // Calculate start_date and end_date based on current date and duration
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setMonth(end_date.getMonth() + duration);

    const sql = "UPDATE Membership SET start_date = ?, end_date = ?, payment_id = ?, order_id = ? WHERE membership_id = ?";
    db.query(sql, [start_date, end_date, payment_id, order_id, membership_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Membership updated successfully", start_date, end_date });
    });
});

module.exports = router;