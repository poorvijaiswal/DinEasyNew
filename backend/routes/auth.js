const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto'); // Added for generating verification code

dotenv.config();
const router = express.Router();

// Nodemailer setup for email verification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register Owner with Email Verification
router.post('/register', async (req, res) => {
    const { owner_name, email, password, phone } = req.body;

    if (!owner_name || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if email already exists
    db.query('SELECT * FROM Membership WHERE email = ?', [email], async (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Insert into Membership table
        db.query(
            'INSERT INTO Membership (owner_name, email, password, phone, verified, verification_code) VALUES (?, ?, ?, ?, 0, ?)',
            [owner_name, email, hashedPassword, phone, verificationCode],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                // Send verification email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Verify Your Email',
                    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending verification email:', error);
                        return res.status(500).json({ message: 'Error sending verification email', error });
                    }
                    console.log('Verification email sent:', info.response);
                    res.status(201).json({ message: 'Owner registered! Check email for verification.' });
                });
            }
        );
    });
});

// Verify Email with Code
router.post('/verify', (req, res) => { // Added
    const { email, verificationCode } = req.body;

    // Check verification code
    db.query('SELECT * FROM Membership WHERE email = ? AND verification_code = ?', [email, verificationCode], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid verification code' });

        // Update user's verified status in the database
        db.query('UPDATE Membership SET verified = 1 WHERE email = ?', [email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(200).json({ message: 'Email verified successfully' });
        });
    });
});

// Membership Selection
router.post('/select-membership', (req, res) => {
    const { email, membershipType } = req.body;

    // Update membership type in the database
    db.query('UPDATE Membership SET membership_type = ? WHERE email = ?', [membershipType, email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.status(200).json({ message: 'Membership selected successfully' });
    });
});

// Payment Processing
router.post('/payment', (req, res) => {
    const { email, paymentDetails } = req.body;

    // Process payment (this is a placeholder, integrate with a real payment gateway)
    const paymentSuccess = true;

    if (paymentSuccess) {
        res.status(200).json({ message: 'Payment successful' });
    } else {
        res.status(400).json({ message: 'Payment failed' });
    }
});

// Owner Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Membership WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) return res.status(400).json({ message: 'Invalid email!' });

        const owner = results[0];

        // CHECK IF USER IS VERIFIED BEFORE ALLOWING LOGIN
        if (owner.verified === 0) {
            // Generate a new verification code
            const newVerificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Update the verification code in the database
            db.query('UPDATE Membership SET verification_code = ? WHERE email = ?', [newVerificationCode, email], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                // Send the new verification email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Verify Your Email',
                    html: `<p>Your new verification code is: <strong>${newVerificationCode}</strong></p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending verification email:', error);
                        return res.status(500).json({ message: 'Error sending verification email', error });
                    }
                    console.log('Verification email sent:', info.response);
                    return res.status(403).json({ message: 'Please verify your email. A new verification code has been sent to your email.' });
                });
            });
        } else {
            if (!(await bcrypt.compare(password, owner.password))) {
                return res.status(400).json({ message: 'Incorrect password!' });
            }

            // Generate token
            const token = jwt.sign({ id: owner.membership_id, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.json({ message: 'Login successful', token });
        }
    });
});

// Staff Login
router.post('/staff-login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) return res.status(400).json({ message: 'Invalid email!' });

        const staff = results[0];

        // CHECK IF USER IS VERIFIED BEFORE ALLOWING LOGIN
        if (staff.verified === 0) {
            // Generate a new verification code
            const newVerificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Update the verification code in the database
            db.query('UPDATE Staff SET verification_code = ? WHERE email = ?', [newVerificationCode, email], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                // Send the new verification email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Verify Your Email',
                    html: `<p>Your new verification code is: <strong>${newVerificationCode}</strong></p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending verification email:', error);
                        return res.status(500).json({ message: 'Error sending verification email', error });
                    }
                    console.log('Verification email sent:', info.response);
                    return res.status(403).json({ message: 'Please verify your email. A new verification code has been sent to your email.' });
                });
            });
        } else {
            if (!(await bcrypt.compare(password, staff.password))) {
                return res.status(400).json({ message: 'Incorrect password!' });
            }

            // Generate token
            const token = jwt.sign({ id: staff.staff_id, role: staff.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.json({ message: 'Login successful', token });
        }
    });
});

// Export the router
module.exports = router;