const db = require("../config/db");

// Create a preorder
const createPreorder = (req, res) => {
    const { restaurant_id, customer_id, items } = req.body;

    if (!restaurant_id || !items || items.length === 0) {
        return res.status(400).json({ message: "Invalid preorder data" });
    }

    // Calculate estimated wait time (e.g., 5 minutes per preorder in queue)
    const sqlCount = "SELECT COUNT(*) AS queueLength FROM Preorders WHERE restaurant_id = ? AND status = 'Pending'";
    db.query(sqlCount, [restaurant_id], (err, result) => {
        if (err) {
            console.error("Error calculating queue length:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        const queueLength = result[0].queueLength;
        const averagePreparationTime = 5; // Example: 5 minutes per order
        const estimatedWaitTime = queueLength === 0 ? averagePreparationTime : queueLength < 4 ? queueLength * averagePreparationTime: queueLength * 4; 

        const sqlInsert = `
            INSERT INTO Preorders (restaurant_id, customer_id, items, status, estimated_wait_time)
            VALUES (?, ?, ?, 'Pending', ?)
        `;
        db.query(sqlInsert, [restaurant_id, customer_id, JSON.stringify(items), estimatedWaitTime], (err, result) => {
            if (err) {
                console.error("Error creating preorder:", err);
                return res.status(500).json({ message: "Database error", error: err });
            }
            res.status(201).json({
                message: "Preorder created successfully",
                preorder_id: result.insertId,
                estimated_wait_time: estimatedWaitTime,
            });
        });
    });
};

// Get all preorders for a restaurant
const getPreordersByRestaurant = (req, res) => {
    const { restaurant_id } = req.params;

    const sql = "SELECT * FROM Preorders WHERE restaurant_id = ? ORDER BY preorder_date ASC";
    db.query(sql, [restaurant_id], (err, results) => {
        if (err) {
            console.error("Error fetching preorders:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
};

module.exports = { createPreorder, getPreordersByRestaurant };