const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db.js");// Import database connection
const verifyToken = require("./middleware/auth");
const socketIo = require("socket.io");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

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
app.use("/api/auth", authRoutes);
app.use('/api', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  });

//protected route

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurant', restaurantRoutes);

const menuRoutes = require('./routes/menu');
app.use('/api', menuRoutes);

const membershipRoutes = require('./routes/membership');
app.use('/api/membership', membershipRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', verifyToken, qrRoutes);

const staffRoutes = require('./routes/staff');
app.use('/api', staffRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

const preorderRoutes = require("./routes/preorderRoutes");
app.use("/api/preorder", preorderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});