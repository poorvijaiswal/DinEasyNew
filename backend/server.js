const express = require("express");
const path = require('path');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db.js"); // Import database connection

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test database connection
db.query("SELECT 1", (err) => {
    if (err) {
        console.error("Database test query failed:", err);
    } else {
        console.log("Database is connected and working!");
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// import Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/user", authRoutes);


const restaurantRoutes = require('./routes/restaurant');
app.use('/restaurant', restaurantRoutes);

const menuRoutes = require('./routes/menu');
app.use('/menu', menuRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
