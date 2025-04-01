const QRCode = require('qrcode');
const db = require('../config/db');

const generateQRCode = async (req, res) => {
    const { tableNumber, size, restaurantId } = req.body;
    console.log(restaurantId);
    const qrText = `http://localhost:3000/order?table=${tableNumber}`;

    try {
        console.log('Generating QR code for:', qrText, 'with size:', size);

        // Generate QR Code as a Base64 image
        const qrCodeUrl = await QRCode.toDataURL(qrText, { width: size, height: size });
        console.log('Generated QR code URL:', qrCodeUrl);

        // Store QR code in MySQL database
        console.log('restaurantId:', restaurantId);
        
        // Check if a QR code already exists for the same restaurant and table number
        db.query(
            'SELECT * FROM TableQR WHERE restaurant_id = ? AND table_number = ?',
            [restaurantId, tableNumber],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                if (results.length > 0) {
                    return res.status(400).json({ message: 'QR code already exists for this table number' });
                }

                // Store QR code in MySQL database
                db.query(
                    'INSERT INTO TableQR (table_number, qr_code, restaurant_id) VALUES (?, ?, ?)',
                    [tableNumber, qrCodeUrl, restaurantId],
                    (err, result) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ message: 'Database error', error: err });
                        }

                        console.log('QR code stored in database:', result);
                        res.json({ qrCode: qrCodeUrl });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Error generating QR code', error });
    }
};

// const getAllQRCodes = (req, res) => {
//     db.query('SELECT * FROM TableQR', (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.json(results);
//     });
// };

// module.exports = { generateQRCode, getAllQRCodes };

const getAllQRCodesByRestaurantId = (req, res) => {
    const { restaurantId } = req.params;
    db.query('SELECT * FROM TableQR WHERE restaurant_id = ?', [restaurantId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
};

// Delete QR Code
const deleteQRCode = async (req, res) => {
    try {
      const { qrId } = req.params;
      await QRCode.findByIdAndDelete(qrId);
      res.status(200).json({ message: 'QR code deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting QR code', error });
    }
  };

module.exports = { generateQRCode, getAllQRCodesByRestaurantId, deleteQRCode };