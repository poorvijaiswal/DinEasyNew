const express = require("express");
const db = require("../config/db");

const router = express.Router();

//  Place an Order
router.post("/order", async (req, res) => {  //  Changed /orders to /order
    console.log("🔹 Order API called with data:", req.body);
    const { items, table_number, restaurant_id } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: " No items in order!" });
    }

    const status = "Pending";
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

module.exports = router;
