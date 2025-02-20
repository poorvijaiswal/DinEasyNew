const QRCode = require('qrcode');
const db = require('../config/db');

const generateQRCode = async (req, res) => {
    const { tableNumber, size, restaurantId } = req.body; // Include restaurantId in the request body
    const qrText = `http://localhost:3000/order?table=${tableNumber}`;

    try {
        console.log('Generating QR code for:', qrText, 'with size:', size);

        // Generate QR Code as a Base64 image
        const qrCodeUrl = await QRCode.toDataURL(qrText, { width: size, height: size });
        console.log('Generated QR code URL:', qrCodeUrl);

        // Store QR code in MySQL database
        db.query(
            'INSERT INTO TableQR (table_number, qr_code, restaurant_id) VALUES (?, ?, ?)',
            [tableNumber, qrCodeUrl, restaurantId],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err); // Log the error
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                console.log('QR code stored in database:', result);
                res.json({ qrCode: qrCodeUrl });
            }
        );
    } catch (error) {
        console.error('Error generating QR code:', error); // Log the error
        res.status(500).json({ message: 'Error generating QR code', error });
    }
};

module.exports = { generateQRCode };