const express = require("express");
const { generateQRCode, getQRCodes } = require("../controllers/qrController");

const router = express.Router();

router.post("/generate", generateQRCode);
router.get("/all", getQRCodes);

module.exports = router;