const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Debugging statement

    if (!authHeader) {
        console.log('No authorization header provided'); // Debugging statement
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format
    console.log('Extracted Token:', token); // Debugging statement

    if (!token) {
        console.log('No token provided'); // Debugging statement
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token Verification Error:', err); // Debugging statement
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        console.log('Decoded Token:', decoded); // Debugging statement
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;