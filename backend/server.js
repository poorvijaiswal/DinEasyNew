const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const qrRoutes = require('./routes/qrRoutes');
const userRoutes = require("./routes/user"); 
const path = require("path");
// const menuRoutes = require("./routes/menu");
const db = require("./config/db.js");// Import database connection

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test database connection
db.query("SELECT 1", (err) => {
    if (err) {
        console.error("Database test query failed:", err);
    } else {
        console.log(" Database is connected and working!");
    }
});

// Define Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});


// Import and use routes
app.use("/api/user", userRoutes);
// app.use("/api/auth", require("./routes/auth"));
// app.use("/restaurant", require("./routes/restaurant"));
app.use('/api/qr', qrRoutes);
// app.use("/api/menu", menuRoutes); // Ensure this line is correct

// Start the server

// import Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurant', restaurantRoutes);

const menuRoutes = require('./routes/menu');
app.use('/menu', menuRoutes);

const membershipRoutes = require('./routes/membership');
const paymentRoutes = require('./routes/payment');

app.use('/api/membership', membershipRoutes);
app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});