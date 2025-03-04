const express = require("express");
const db = require("../config/db");  // Import database connection
const router = express.Router();

// 📌 Get all orders with items
router.get("/", (req, res) => {
    const sql = `
        SELECT o.order_id, o.restaurant_id, o.table_id, o.order_date, o.status,
               oi.order_item_id, oi.menu_id, oi.quantity, oi.price
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
        ORDER BY o.order_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

        const orders = {};
        results.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    restaurant_id: row.restaurant_id,
                    table_id: row.table_id,
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
    });
});

// 📌 Add a new order with items
router.post("/", (req, res) => {
    const { restaurant_id, table_id, items } = req.body;

    const orderSql = "INSERT INTO Orders (restaurant_id, table_id, order_date) VALUES (?, ?, NOW())";
    db.query(orderSql, [restaurant_id, table_id], (err, result) => {
        if (err) return res.status(500).send(err);

        const orderId = result.insertId;
        const itemValues = items.map(i => [orderId, i.menu_id, i.quantity, i.price]);

        const itemsSql = "INSERT INTO OrderItems (order_id, menu_id, quantity, price) VALUES ?";
        db.query(itemsSql, [itemValues], (err) => {
            if (err) return res.status(500).send(err);

            res.json({ success: true, message: "Order placed!", orderId });
        });
    });
});

// 📌 Update order status
router.put("/:id", (req, res) => {
    const { status } = req.body;
    db.query("UPDATE Orders SET status=? WHERE order_id=?", [status, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true, message: "Order status updated!" });
    });
});

// 📌 Delete an order
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM OrderItems WHERE order_id=?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);

        db.query("DELETE FROM Orders WHERE order_id=?", [req.params.id], (err) => {
            if (err) return res.status(500).send(err);
            res.json({ success: true, message: "Order deleted!" });
        });
    });
});

module.exports = router;
