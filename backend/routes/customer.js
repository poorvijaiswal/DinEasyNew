const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/order/:order_id", (req, res) => {
    const orderId = req.params.order_id;
  
    const sql = `
      SELECT o.order_id, o.table_number, o.status, oi.quantity, m.name, m.price, oi.order_item_id
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Menu m ON oi.menu_id = m.id
      WHERE o.order_id = ?
    `;
  
    db.query(sql, [orderId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const order = {
        order_id: results[0].order_id,
        table_number: results[0].table_number,
        status: results[0].status,
        items: results.map(row => ({
          order_item_id: row.order_item_id,
          quantity: row.quantity,
          name: row.name,
          price: row.price,
        }))
      };
  
      res.json(order);
    });
  });
  
module.exports = router;
