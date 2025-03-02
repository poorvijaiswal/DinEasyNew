import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QRCodeDisplay.css"; 
import DashboardLayout from "../../components/DashboardLayout";

const QRCodeDisplay = () => {
  const [qrCodes, setQRCodes] = useState([]);

  const [restaurantId, setRestaurantId] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Fetch restaurant_id from the backend
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found in local storage");
        }
        const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
          headers: {
            Authorization: `Bearer ${token}` // Ensure no double quotes around the token
          }
        });
        setRestaurantId(response.data.restaurant_id);
      } catch (error) {
        console.error("Error fetching restaurant ID", error);
        setMessage("Error fetching restaurant ID");
      }
    };

    fetchRestaurantId();
  }, []);
  

  useEffect(() => {
    if (restaurantId) {
      // Fetch QR codes for the specific restaurant ID
      const fetchQRCodes = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/qr/getAllQRCodes/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}` // Ensure no double quotes around the token
            }
          });
          setQRCodes(response.data);
        } catch (error) {
          console.error("Error fetching QR codes", error);
          setMessage("Error fetching QR codes");
        }
      };

      fetchQRCodes();
    }
  }, [restaurantId]);

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default QRCodeDisplay;