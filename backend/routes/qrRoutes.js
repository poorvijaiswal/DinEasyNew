const express = require('express');
const { generateQRCode, getAllQRCodes } = require('../controllers/qrController');
const router = express.Router();

router.post('/generate', generateQRCode);
router.get('/getAll', getAllQRCodes);

module.exports = router;