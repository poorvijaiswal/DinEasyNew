const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db"); // Import database connection
const verifyToken = require("./middleware/auth");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test database connection
db.query("SELECT 1", (err) => {
    if (err) {
        console.error("Database test query failed:", err);
    } else {
        console.log("Database is connected and working!");
    }
});

// Define Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Import and use routes
const userRoutes = require("./routes/user");
app.use('/api/user', userRoutes);

const authRoutes = require("./routes/auth");
app.use('/api/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurant', restaurantRoutes);

const menuRoutes = require('./routes/menu');
app.use('/menu', menuRoutes);

const membershipRoutes = require('./routes/membership');
app.use('/api/membership', membershipRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', verifyToken, qrRoutes);

const staffRoutes = require('./routes/staff');
app.use('/api', staffRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});