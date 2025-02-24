const express = require('express');
const { generateQRCode, getAllQRCodesByRestaurantId } = require('../controllers/qrController');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.post('/generate', generateQRCode);
// router.get('/getAll', getAllQRCodes);
router.get('/getAllQRCodes/:restaurantId', verifyToken, getAllQRCodesByRestaurantId);

module.exports = router;