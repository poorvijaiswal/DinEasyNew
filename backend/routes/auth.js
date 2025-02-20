const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { getAuth } = require('firebase-admin/auth');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto'); // For generating the verification code
const { body, validationResult } = require('express-validator');
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
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
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
            [name, email, hashedPassword, phone, verificationCode],
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

// Login Endpoint
router.post('/login', body('email').isEmail().withMessage('Enter a valid email'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.verified === 0) {
            return res.status(400).json({ message: 'Email not verified or Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password Endpoint
router.post('/forgot-password', body('email').isEmail().withMessage('Enter a valid email'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Generate password reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send email with password reset link
        const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click on the link to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password Endpoint
router.post('/reset-password/:resetToken', body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
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

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json'); // Replace with the path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const { email, name } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    // Generate a token for the user (e.g., JWT)
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: authToken });
  } catch (error) {
    res.status(400).json({ message: 'Google login failed' });
  }
});

module.exports = router;