import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QRCodeDisplay.css"; 

const QRCodeDisplay = () => {
  const [qrCodes, setQRCodes] = useState([]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/qr/getAll");
        console.log("Fetched QR Codes:", response.data); // Debugging step
        setQRCodes(response.data);
      } catch (error) {
        console.error("Error fetching QR codes:", error);
      }
    };
    fetchQRCodes();
  }, []);

  return (
    <div className="qr-display">
      <h1>All Generated QR Codes</h1>
      <div className="qr-list">
        {qrCodes.length === 0 ? (
          <p>No QR codes generated yet.</p>
        ) : (
          qrCodes.map((qr, index) => (
            <div key={index} className="qr-item">
              <img src={qr.qr_code} alt={`QR Code for Table ${qr.table_number}`} />
              <p><b>Table Number: {qr.table_number}</b></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QRCodeDisplay;