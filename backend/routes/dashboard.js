const express = require('express');
const router = express.Router();
const db = require('../config/db'); // make sure this is your MySQL connection instance

router.get('/overview', (req, res) => {
  const data = {
    totalSales: 0,
    activeOrders: 0,
    pendingDeliveries: 0,
    averageRating: 0,
  };

  db.query(`SELECT SUM(amount) AS total FROM payment WHERE status = 'Paid'`, (err, results) => {
    if (err) {
      console.error('Error fetching total sales:', err);
      return res.status(500).json({ error: 'Failed to fetch total sales' });
    }

    data.totalSales = results[0].total || 0;

    db.query(`SELECT COUNT(*) AS count FROM orders WHERE status IN ('Pending', 'In Progress')`, (err, results) => {
      if (err) {
        console.error('Error fetching active orders:', err);
        return res.status(500).json({ error: 'Failed to fetch active orders' });
      }

      data.activeOrders = results[0].count || 0;

      db.query(`SELECT COUNT(*) AS count FROM food_tokens WHERE status = 'pending'`, (err, results) => {
        if (err) {
          console.error('Error fetching pending deliveries:', err);
          return res.status(500).json({ error: 'Failed to fetch pending deliveries' });
        }

        data.pendingDeliveries = results[0].count || 0;

      });
    });
  });
});