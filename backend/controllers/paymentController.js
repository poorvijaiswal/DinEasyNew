const db = require("../config/db");

// Create a new payment record
exports.createPayment = async (req, res) => {
  const { order_id, amount, payment_method } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ message: "Order ID and amount are required" });
  }

  try {
    // Check if the `order_id` exists in the `Orders` table
    const orderExists = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM orders WHERE order_id = ?", [order_id], (err, result) =>
        err ? reject(err) : resolve(result.length > 0)
      );
    });

    if (!orderExists) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Insert into `Payment` table
    const sql = `
      INSERT INTO Payment (order_id, amount, payment_method, status, payment_date)
      VALUES (?, ?, ?, 'Pending', NOW())
    `;
    const values = [order_id, amount, payment_method || "UPI"];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting payment:", err);
        return res.status(500).json({ message: "Error inserting payment" });
      }

      res.status(201).json({ message: "Payment created successfully", payment_id: result.insertId });
      
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update payment status and add order to Orders table
// exports.updatePaymentStatus = async (req, res) => {
//   const { payment_id, status, order_id, items, table_number, restaurant_id } = req.body;

//   if (!payment_id || !status || !order_id || !items || !table_number || !restaurant_id) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Update payment status
//     const sql = `
//       UPDATE Payment
//       SET status = ?, payment_date = NOW()
//       WHERE payment_id = ?
//     `;
//     const values = [status, payment_id];

//     db.query(sql, values, async (err) => {
//       if (err) {
//         console.error("Error updating payment status:", err);
//         return res.status(500).json({ message: "Error updating payment status" });
//       }

//       if (status === "Paid") {
//         try {
//           // Insert into `orders` table
//           const orderResult = await new Promise((resolve, reject) => {
//             db.query(
//               "INSERT INTO orders (restaurant_id, table_number, order_date, status) VALUES (?, ?, NOW(), 'Pending')",
//               [restaurant_id, table_number],
//               (err, result) => (err ? reject(err) : resolve(result))
//             );
//           });


//           const newOrderId = orderResult.insertId;

//           // Insert into `orderitems` table
//           let orderItemsValues = [];
//           for (const item of items) {
//             const menuResult = await new Promise((resolve, reject) => {
//               db.query("SELECT price FROM menu WHERE id = ?", [item.id], (err, result) =>
//                 err ? reject(err) : resolve(result)
//               );
//             });

//             if (!menuResult.length) {
//               return res.status(404).json({ message: `Menu item ${item.id} not found` });
//             }

//             orderItemsValues.push([newOrderId, item.id, item.quantity, menuResult[0].price]);
//           }

//           if (orderItemsValues.length) {
//             await new Promise((resolve, reject) => {
//               db.query(
//                 "INSERT INTO orderitems (order_id, menu_id, quantity, price) VALUES ?",
//                 [orderItemsValues],
//                 (err) => (err ? reject(err) : resolve())
//               );
//             });
//           }

//           res.status(200).json({
//             message: "Payment status updated, order placed successfully!",
//             order_id: newOrderId,
//           });
//         } catch (error) {
//           console.error("Error placing order:", error);
//           res.status(500).json({ message: "Error placing order", details: error });
//         }
//       } else {
//         res.status(200).json({ message: "Payment status updated successfully" });
//       }
//     });
//   } catch (error) {
//     console.error("Error updating payment status:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.updatePaymentStatus = async (req, res) => {
  const { payment_id, status } = req.body;

  if (!payment_id || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Update payment status
    const sql = `
      UPDATE Payment
      SET status = ?, payment_date = NOW()
      WHERE payment_id = ?
    `;
    const values = [status, payment_id];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Error updating payment status:", err);
        return res.status(500).json({ message: "Error updating payment status" });
      }

      if (status === "Paid") {
        res.status(200).json({ message: "Payment status updated successfully!" });
      } else {
        res.status(200).json({ message: "Payment status updated successfully!" });
      }
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};