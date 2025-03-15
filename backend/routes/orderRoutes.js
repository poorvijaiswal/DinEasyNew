const express = require("express");
const db = require("../config/db");  
const router = express.Router();

//  Place an Order
router.post("/", async (req, res) => {
    console.log(" Order API called with data:", req.body);

    const { cart, totalPrice, table_number, restaurant_id } = req.body;

    if (!cart || cart.length === 0) {
        console.log(" Error: Cart is empty");
        return res.status(400).json({ message: "Cart is empty!" });
    }

    try {
        const status = "Pending";
        
        // Insert order into database
        const [orderResult] = await db.execute(
            "INSERT INTO orders (restaurant_id, table_number, order_date, status) VALUES (?, ?, NOW(), ?)",
            [restaurant_id, table_number, status]
        );

        if (!orderResult.insertId) {
            throw new Error(" Failed to insert order.");
        }

        const order_id = orderResult.insertId;
        console.log(" Order placed with ID:", order_id);

        //  Insert order items
        for (let item of cart) {
            await db.execute(
                "INSERT INTO orderitems (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)",
                [order_id, item.id, item.quantity, item.price]
            );
        }

        res.status(201).json({ message: " Order placed successfully!", order_id });
    } catch (error) {
        console.error(" Order placement error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

//  Get all orders with items
router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT o.order_id, o.restaurant_id, o.table_number, o.order_date, o.status,
                   oi.order_item_id, oi.menu_id, oi.quantity, oi.price
            FROM orders o
            LEFT JOIN orderitems oi ON o.order_id = oi.order_id
            ORDER BY o.order_date DESC
        `;

        const [results] = await db.execute(sql);

        const orders = {};
        results.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    restaurant_id: row.restaurant_id,
                    table_number: row.table_number,
                    order_date: row.order_date,
                    status: row.status,
                    items: [],
                };
            }
            if (row.order_item_id) {
                orders[row.order_id].items.push({
                    order_item_id: row.order_item_id,
                    menu_id: row.menu_id,
                    quantity: row.quantity,
                    price: row.price,
                });
            }
        });

        res.json(Object.values(orders));
    } catch (error) {
        console.error(" Fetch orders error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  Update Order Status
router.put("/:id", async (req, res) => {
    const { status } = req.body;

    try {
        await db.execute("UPDATE orders SET status=? WHERE order_id=?", [status, req.params.id]);
        res.json({ success: true, message: " Order status updated!" });
    } catch (error) {
        console.error(" Order update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  Delete an Order
router.delete("/:id", async (req, res) => {
    try {
        await db.execute("DELETE FROM orderitems WHERE order_id=?", [req.params.id]);
        await db.execute("DELETE FROM orders WHERE order_id=?", [req.params.id]);

        res.json({ success: true, message: " Order deleted!" });
    } catch (error) {
        console.error(" Order deletion error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
