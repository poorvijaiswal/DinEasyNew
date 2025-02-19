import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeDisplay = () => {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const response = await axios.get("/api/qr/all");
        setQrCodes(response.data);
      } catch (error) {
        console.error("Error fetching QR codes", error);
      }
    };

    fetchQRCodes();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Generated QR Codes</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {qrCodes.map((qrCode, index) => (
          <div key={index} style={{ margin: "10px" }}>
            <QRCodeCanvas value={qrCode.qrCode} size={qrCode.size} />
            <p>Table Number: {qrCode.tableNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeDisplay;