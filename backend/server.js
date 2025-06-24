const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db.js"); // Import database connection
const verifyToken = require("./middleware/auth");
const http = require("http");
const socketIo = require("socket.io");

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Expose socket.io to the app
app.set("socketio", io);

// Middleware
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
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

// WebSocket connection
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const userRoutes = require("./routes/user");
app.use('/api/user', userRoutes);

const customerRoutes = require("./routes/customer");
app.use("/api/customer", customerRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use('/api', authRoutes);

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
if (typeof staffRoutes === 'function') {
    app.use('/api', staffRoutes);
} else {
    console.error("Invalid middleware for staffRoutes");
}

const orderRoutes = require('./routes/orderRoutes');
if (typeof orderRoutes === 'function') {
    app.use('/api', orderRoutes);
} else {
    console.error("Invalid middleware for orderRoutes");
}

const preorderRoutes = require("./routes/preorderRoutes");
app.use("/api/preorder", preorderRoutes);

const ngoRoutes = require("./routes/ngoRoutes");
app.use("/api/ngo", ngoRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
if (typeof feedbackRoutes === 'function') {
    app.use('/api', feedbackRoutes);
} else {
    console.error("Invalid middleware for feedbackRoutes");
}

const foodTokensRoutes = require('./routes/foodTokens');
app.use('/api', foodTokensRoutes);

const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api', tokenRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use('/api/dashboard', dashboardRoutes);
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


// Other routes and middleware...

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
