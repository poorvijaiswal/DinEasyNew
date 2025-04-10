const db = require("../config/db");

exports.getOrderDetails = async (req, res) => {
  const { order_id } = req.params;

  if (!order_id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // Fetch order details
    const orderQuery = `
      SELECT 
        o.order_id, 
        o.table_number, 
        o.status, 
        p.amount AS total_price, 
        oi.menu_id, 
        oi.quantity, 
        m.name, 
        m.price
      FROM orders o
      JOIN orderitems oi ON o.order_id = oi.order_id
      JOIN menu m ON oi.menu_id = m.id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.order_id = ?
    `;

    db.query(orderQuery, [order_id], (err, results) => {
      if (err) {
        console.error("Error fetching order details:", err);
        return res.status(500).json({ message: "Error fetching order details" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Format the response
      const orderDetails = {
        order_id: results[0].order_id,
        table_number: results[0].table_number,
        status: results[0].status, // Include order status
        total_price: parseFloat(results[0].total_price), // Ensure total_price is a number
        items: results.map((row) => ({
          id: row.menu_id,
          name: row.name,
          quantity: row.quantity,
          price: row.price,
        })),
      };

      res.status(200).json(orderDetails);
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new function to update the order status
exports.updateOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;

  if (!order_id || !status) {
    return res.status(400).json({ message: "Order ID and status are required" });
  }

  try {
    const updateQuery = `
      UPDATE orders
      SET status = ?
      WHERE order_id = ?
    `;

    db.query(updateQuery, [status, order_id], (err, results) => {
      if (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ message: "Error updating order status" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order status updated successfully" });
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};