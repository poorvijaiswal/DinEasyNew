const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your MySQL config

router.get('/overview', (req, res) => {
  const data = {
    totalSales: 0,
    activeOrders: 0,
    pendingDeliveries: 0,
  };

  db.query(`SELECT SUM(amount) AS total FROM payment WHERE status = 'Paid'`, (err, results) => {
    if (err) {
      console.error('Error fetching total sales:', err);
      return res.status(500).json({ error: 'Failed to fetch total sales' });
    }

    data.totalSales = results[0]?.total || 0;

    db.query(`SELECT COUNT(*) AS count FROM orders WHERE status IN ('Pending', 'In Progress')`, (err, results) => {
      if (err) {
        console.error('Error fetching active orders:', err);
        return res.status(500).json({ error: 'Failed to fetch active orders' });
      }

      data.activeOrders = results[0]?.count || 0;

      db.query(`SELECT COUNT(*) AS count FROM food_tokens WHERE status = 'Pending'`, (err, results) => {
        if (err) {
          console.error('Error fetching pending deliveries:', err);
          return res.status(500).json({ error: 'Failed to fetch pending deliveries' });
        }

        data.pendingDeliveries = results[0]?.count || 0;

        // Send the final response
        res.json(data);
      });
    });
  });
});
// Route to fetch sales by item (daily)
router.get('/sales-by-item', (req, res) => {
  const query = `
    SELECT 
      DATE(o.order_date) AS date,
      m.name AS item_name,
      SUM(oi.quantity * oi.price) AS total_sales
    FROM orders o
    JOIN payment p ON p.order_id = o.order_id AND p.status = 'Paid'
    JOIN orderitems oi ON oi.order_id = o.order_id
    JOIN menu m ON m.id = oi.menu_id
    GROUP BY DATE(o.order_date), m.name
    ORDER BY DATE(o.order_date), total_sales DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sales by item:', err);
      return res.status(500).json({ error: 'Failed to fetch sales by item' });
    }
    res.json(results); // Send the results back to the client
  });
});

module.exports = router;
