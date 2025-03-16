
const express = require("express");
const db = require("../config/db");
const router = express.Router();
const verifyToken = require("../middleware/auth"); 

//  Fetch Restaurant ID for the authenticated owner
router.get("/auth/getRestaurantId", (req, res) => {
    const ownerEmail = req.user.email; // Assuming authentication middleware extracts email

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

//  Place an Order (table_number remains static or user-input)
router.post("/order", (req, res) => {
    console.log(" Order API called with data:", req.body);
    const { items, table_number, restaurant_id } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: " No items in order!" });
    }

    const status = "Pending";

    //  Insert into orders table
    const orderQuery = "INSERT INTO orders (restaurant_id, table_number, order_date, status) VALUES (?, ?, NOW(), ?)";

    db.query(orderQuery, [restaurant_id, table_number, status], (err, result) => {
        if (err) {
            console.error(" Order placement error:", err);
            return res.status(500).json({ message: " Database error", details: err });
        }

        const order_id = result.insertId;
        console.log(` Order placed successfully! Order ID: ${order_id}`);

        let orderItemsValues = [];

        // Loop through items and fetch price from menu
        items.forEach((item, index) => {
            db.query("SELECT price FROM menu WHERE id = ?", [item.id], (err, menuResult) => {
                if (err) {
                    console.error(` Error fetching menu item ${item.id}:`, err);
                    return res.status(500).json({ message: " Database error", details: err });
                }

                if (!menuResult.length) {
                    console.log(` Error: Menu item ${item.id} not found`);
                    return res.status(404).json({ message: `Menu item ${item.id} not found` });
                }

                const price = menuResult[0].price;
                orderItemsValues.push([order_id, item.id, item.quantity, price]);

                //  Insert into orderitems once all items are processed
                if (orderItemsValues.length === items.length) {
                    db.query("INSERT INTO orderitems (order_id, menu_id, quantity, price) VALUES ?", [orderItemsValues], (err) => {
                        if (err) {
                            console.error(" Error inserting order items:", err);
                            return res.status(500).json({ message: " Database error", details: err });
                        }

                        console.log(" Order items stored successfully!");
                        res.status(201).json({ message: " Order placed successfully!", order_id });
                    });
                }
            });
        });
    });
});

//  Get all orders with items
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
router.put("/order/:id", (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status=? WHERE order_id=?", [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        res.json({ success: true, message: "Order status updated!" });
    });
});
router.delete("/order/:id", (req, res) => {
    db.query("DELETE FROM orderitems WHERE order_id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        db.query("DELETE FROM orders WHERE order_id=?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Database error", details: err });
            res.json({ success: true, message: "Order deleted!" });
        });
    });
});

module.exports = router;
