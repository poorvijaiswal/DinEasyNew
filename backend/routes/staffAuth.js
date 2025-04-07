const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const COMMON_PASSWORD = process.env.STAFF_COMMON_PASSWORD || 'staff@123';

router.post("/staff-login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query('SELECT * FROM Staff WHERE email = ?', [email], (err, staffResults) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (staffResults.length === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const staff = staffResults[0];

        db.query('SELECT * FROM StaffLogin WHERE staff_id = ?', [staff.staff_id], (err, loginResults) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            if (loginResults.length === 0) {
                return res.status(403).json({ message: 'Login record not found for staff.' });
            }

            const login = loginResults[0];

            if (!login.is_verified) {
                return res.status(403).json({ message: 'Staff not verified. Please contact admin.' });
            }

            if (password !== COMMON_PASSWORD) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }

            const token = jwt.sign(
                {
                    staff_id: staff.staff_id,
                    role: staff.role,
                    restaurant_id: staff.restaurant_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
                staff_id: staff.staff_id,
                name: staff.name,
                role: staff.role,
                restaurant_id: staff.restaurant_id
            });
        });
    });
});

module.exports = router; // ✅ export only the router directly
