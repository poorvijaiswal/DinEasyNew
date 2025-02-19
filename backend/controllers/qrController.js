const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../config/db');

const generateQRCode = async (req, res) => {
  const { tableNumber, size } = req.body;

  try {
    // Check if the table number already exists
    const [rows] = await db.query('SELECT * FROM qr_codes WHERE tableNumber = ?', [tableNumber]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const orderId = uuidv4();
    const qrCode = await QRCode.toDataURL(orderId);

    // Save the orderId, qrCode, and tableNumber to the database
    await db.query('INSERT INTO qr_codes (orderId, qrCode, tableNumber, size) VALUES (?, ?, ?, ?)', [orderId, qrCode, tableNumber, size]);

    res.json({ orderId, qrCode });
  } catch (error) {
    console.error("Error generating QR code", error);
    res.status(500).json({ message: 'Error generating QR code' });
  }
};

const getQRCodes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM qr_codes');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching QR codes", error);
    res.status(500).json({ message: 'Error fetching QR codes' });
  }
};

module.exports = {
  generateQRCode,
  getQRCodes,
};