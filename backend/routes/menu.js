const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Middleware: Verify if user is an Owner or Staff
const verifyOwnerOrStaff = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: 'Unauthorized access' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const { id, role } = decoded; // Extract user ID and role

        if (role === 'owner') {
            req.user = { id, role }; 
            return next(); // Owner is allowed
        }

        // If staff, check if they belong to a restaurant
        db.query('SELECT * FROM Staff WHERE staff_id = ?', [id], (error, results) => {
            if (error) return res.status(500).json({ message: 'Database error', error });
            if (results.length === 0) return res.status(403).json({ message: 'Access denied' });

            req.user = { id, role: results[0].role, restaurant_id: results[0].restaurant_id };
            return next();
        });
    });
};

//  Add Menu Item (Owner/Staff)
router.post('/add', verifyOwnerOrStaff, (req, res) => {
    const { restaurant_id, category, name, price, image_url } = req.body;

    // Staff can only modify their own restaurant’s menu
    if (req.user.role !== 'owner' && req.user.restaurant_id !== restaurant_id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    db.query(
        'INSERT INTO Menu (restaurant_id, category, name, price, image_url) VALUES (?, ?, ?, ?, ?)',
        [restaurant_id, category, name, price, image_url],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(201).json({ message: 'Menu item added successfully!' });
        }
    );
});

// ✅ Update Menu Item (Owner/Staff)
router.put('/update/:menuId', verifyOwnerOrStaff, (req, res) => {
    const { menuId } = req.params;
    const { category, name, price, image_url } = req.body;

    // Check if menu item belongs to the staff’s restaurant
    db.query('SELECT restaurant_id FROM Menu WHERE menu_id = ?', [menuId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Menu item not found' });

        const menuRestaurantId = results[0].restaurant_id;

        if (req.user.role !== 'owner' && req.user.restaurant_id !== menuRestaurantId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Proceed with the update
        db.query(
            'UPDATE Menu SET category = ?, name = ?, price = ?, image_url = ? WHERE menu_id = ?',
            [category, name, price, image_url, menuId],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ message: 'Database error', error: updateErr });
                res.json({ message: 'Menu item updated successfully!' });
            }
        );
    });
});

// ✅ Delete Menu Item (Owner/Staff)
router.delete('/delete/:menuId', verifyOwnerOrStaff, (req, res) => {
    const { menuId } = req.params;

    // Check if menu item belongs to the staff’s restaurant
    db.query('SELECT restaurant_id FROM Menu WHERE menu_id = ?', [menuId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Menu item not found' });

        const menuRestaurantId = results[0].restaurant_id;

        if (req.user.role !== 'owner' && req.user.restaurant_id !== menuRestaurantId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Proceed with deletion
        db.query('DELETE FROM Menu WHERE menu_id = ?', [menuId], (deleteErr) => {
            if (deleteErr) return res.status(500).json({ message: 'Database error', error: deleteErr });
            res.json({ message: 'Menu item deleted successfully!' });
        });
    });
});

const multer = require("multer");
const path = require("path");

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route to insert menu item
router.post("/", upload.single("image"), (req, res) => {
  const { category_id, name, price, description } = req.body;
  const image_url = req.file ? req.file.filename : null;

  if (!category_id || !name || !price || !description || !image_url) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql =
    "INSERT INTO menu_items (category_id, name, price, description, image_url) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [category_id, name, price, description, image_url], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to add menu item." });
    }
    res.json({ message: "Menu item added successfully!", menuItemId: result.insertId });
  });
});


// ✅ Export the Router
module.exports = router;