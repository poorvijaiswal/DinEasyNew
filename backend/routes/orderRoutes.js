const express = require("express");
const db = require("../config/db");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getOrderDetails } = require("../controllers/orderController");

// ✅ Get Restaurant ID for the authenticated owner
router.get("/auth/getRestaurantId", verifyToken, (req, res) => {
    const ownerEmail = req.user.email;

    if (!ownerEmail) {
        return res.status(401).json({ message: "Unauthorized: No user email found" });
    }

    const query = "SELECT id FROM restaurants WHERE owner_email = ?";
    db.query(query, [ownerEmail], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ restaurant_id: result[0].id });
    });
});

// ✅ Place an Order (Optimized)
// router.post("/order", async (req, res) => {
//     console.log("Order API called with data:", req.body);
//     const { items, table_number, restaurant_id } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//         return res.status(400).json({ message: "No items in order!" });
//     }

//     const status = "Pending";

//     try {
//         // Insert into `orders` table
//         const orderResult = await new Promise((resolve, reject) => {
//             db.query(
//                 "INSERT INTO orders (restaurant_id, table_number, order_date, status) VALUES (?, ?, NOW(), ?)",
//                 [restaurant_id, table_number, status],
//                 (err, result) => (err ? reject(err) : resolve(result))
//             );
//         });

//         const order_id = orderResult.insertId;
//         console.log(`Order placed successfully! Order ID: ${order_id}`);

//         // Fetch prices and insert into `orderitems` table
//         let orderItemsValues = [];
//         for (const item of items) {
//             const menuResult = await new Promise((resolve, reject) => {
//                 db.query("SELECT price FROM menu WHERE id = ?", [item.id], (err, result) =>
//                     err ? reject(err) : resolve(result)
//                 );
//             });

//             if (!menuResult.length) {
//                 return res.status(404).json({ message: `Menu item ${item.id} not found` });
//             }

//             orderItemsValues.push([order_id, item.id, item.quantity, menuResult[0].price]);
//         }

//         if (orderItemsValues.length) {
//             await new Promise((resolve, reject) => {
//                 db.query(
//                     "INSERT INTO orderitems (order_id, menu_id, quantity, price) VALUES ?",
//                     [orderItemsValues],
//                     (err) => (err ? reject(err) : resolve())
//                 );
//             });
//         }

//         res.status(201).json({ message: "Order placed successfully!", order_id });
//     } catch (error) {
//         console.error("Order placement error:", error);
//         res.status(500).json({ message: "Database error", details: error });
//     }
// });

router.post("/order", async (req, res) => {
    console.log("Order API called with data:", req.body);
    const { items, table_number, restaurant_id } = req.body;
  
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order!" });
    }
  
    if (!table_number || !restaurant_id) {
      return res.status(400).json({ message: "Table number and restaurant ID are required!" });
    }
  
    try {
      // Insert into `orders` table
      const orderResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO orders (restaurant_id, table_number, order_date, status) VALUES (?, ?, NOW(), 'Pending')",
          [restaurant_id, table_number],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });
  
      const order_id = orderResult.insertId;
  
      // Insert into `orderitems` table
      let orderItemsValues = [];
      for (const item of items) {
        const menuResult = await new Promise((resolve, reject) => {
          db.query("SELECT price FROM menu WHERE id = ?", [item.id], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        });
  
        if (!menuResult.length) {
          return res.status(404).json({ message: `Menu item ${item.id} not found` });
        }
  
        orderItemsValues.push([order_id, item.id, item.quantity, menuResult[0].price]);
      }
  
      if (orderItemsValues.length) {
        await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO orderitems (order_id, menu_id, quantity, price) VALUES ?",
            [orderItemsValues],
            (err) => (err ? reject(err) : resolve())
          );
        });
      }
  
      res.status(201).json({ message: "Order created successfully!", order_id });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Database error", details: error });
    }
  });

  
// ✅ Get all orders with items
router.get("/order", (req, res) => {
    const sql = `
        SELECT o.order_id, o.table_number, o.status, 
               oi.order_item_id, oi.menu_id, oi.quantity, oi.price, m.name AS menu_name
        FROM orders o
        LEFT JOIN orderitems oi ON o.order_id = oi.order_id
        LEFT JOIN menu m ON oi.menu_id = m.id
        ORDER BY o.order_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        const orders = {};
        results.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    table_number: row.table_number,
                    status: row.status,
                    items: [],
                };
            }
            if (row.order_item_id) {
                orders[row.order_id].items.push({
                    order_item_id: row.order_item_id,
                    menu_id: row.menu_id,
                    menu_name: row.menu_name,
                    quantity: row.quantity,
                    price: row.price,
                });
            }
        });

        res.json(Object.values(orders));
    });
});

// ✅ Update order status
router.put("/order/:id", (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status=? WHERE order_id=?", [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        res.json({ success: true, message: "Order status updated!" });
    });
});

// ✅ Delete an order and its items
router.delete("/order/:id", async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            db.query("DELETE FROM orderitems WHERE order_id=?", [req.params.id], (err) =>
                err ? reject(err) : resolve()
            );
        });

        await new Promise((resolve, reject) => {
            db.query("DELETE FROM orders WHERE order_id=?", [req.params.id], (err) =>
                err ? reject(err) : resolve()
            );
        });

        res.json({ success: true, message: "Order deleted!" });
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error });
    }
});

//fetch order details by order_id
router.get("/order/:order_id", getOrderDetails);

module.exports = router;
