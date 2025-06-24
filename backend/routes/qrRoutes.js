const express = require('express');
const { generateQRCode, getAllQRCodesByRestaurantId, deleteQRCode } = require('../controllers/qrController');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.post('/generate', generateQRCode);
router.get('/getAllQRCodes/:restaurantId', verifyToken, getAllQRCodesByRestaurantId);
router.delete('/deleteQRCode/:qrId', verifyToken, deleteQRCode); 

module.exports = router;