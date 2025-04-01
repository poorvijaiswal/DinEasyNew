const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto'); // For generating the verification code
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth');
//const User = require('../models/User'); // Assuming you have a User model in your database

dotenv.config();
const router = express.Router();

// Nodemailer setup for email functionality
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register User with Email Verification
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

                const defaultProfileImage = "default-profile.png";
                
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
router.post('/verify', (req, res) => {
    const { email, verificationCode } = req.body;

    db.query('SELECT * FROM Membership WHERE email = ? AND verification_code = ?', [email, verificationCode], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid verification code' });

        db.query('UPDATE Membership SET verified = 1 WHERE email = ?', [email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(200).json({ message: 'Email verified successfully' });
        });
    });
});

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
router.post('/login', async (req, res) => { // Mark the function as async
    const { email, password } = req.body;

    db.query('SELECT * FROM Membership WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length === 0) {
            return res.status(400).json({ message: 'Email not found!' });
        }

        const owner = results[0];

        if (owner.verified === 0) {
            const newVerificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
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

            // Check if the membership is expired
            const currentDate = new Date();
            if (new Date(owner.end_date) < currentDate) {
                return res.json({ message: 'Membership expired, please renew your membership', membership_id: owner.membership_id, requiresMembershipRenewal: true });
            }

            // Check if the restaurant is registered
            db.query('SELECT * FROM Restaurant WHERE membership_id = ?', [owner.membership_id], (err, restaurantResults) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                const token = jwt.sign({ id: owner.membership_id, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '1d' });

                if (restaurantResults.length === 0) {
                    return res.json({ message: 'Login successful, please register your restaurant', token, membership_id: owner.membership_id, requiresRestaurantRegistration: true });
                } else {
                    return res.json({ message: 'Login successful', token, membership_id: owner.membership_id });
                }
            });
        }
    });
});

// Staff Login
// Staff Login
router.post("/staff-login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Staff WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    const staff = results[0];

    // Check if the staff member is verified
    if (staff.verified === 0) {
      return res.status(403).json({
        message: "Please verify your email. A verification code has been sent to your email.",
        requiresVerification: true,
      });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate a token with the staff's role
    const token = jwt.sign(
      { id: staff.staff_id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Include the role in the response
    res.json({ message: "Login successful", token, role: staff.role });
  });
});

// Get Restaurant ID
router.get('/getRestaurantId', verifyToken, (req, res) => {
    console.log('User from Token:', req.user); // Debugging statement
    const membership_id = req.user.id; // Ensure req.user is set by the middleware
  
    db.query('SELECT restaurant_id FROM Restaurant WHERE membership_id = ?', [membership_id], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Debugging statement
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Restaurant ID not found' });
      }
      res.json({ restaurant_id: results[0].restaurant_id });
    });
  });

//   -----------------------------------------------------------------

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    db.query('SELECT * FROM Membership WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      const user = results[0];
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      db.query('UPDATE Membership SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [resetToken, resetTokenExpiry, email], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }
  
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset',
          html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error });
          }
          console.log('Email sent:', info.response);
          res.json({ message: 'Password reset email sent' });
        });
      });
    });
  });
  
  // Reset Password
  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    db.query('SELECT * FROM Membership WHERE reset_token = ? AND reset_token_expiry > ?', [token, Date.now()], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      const user = results[0];
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query('UPDATE Membership SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE membership_id = ?', [hashedPassword, user.membership_id], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Password reset successful' });
      });
    });
  });

module.exports = router;