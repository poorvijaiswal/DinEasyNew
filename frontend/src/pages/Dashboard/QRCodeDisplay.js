import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QRCodeDisplay.css";
import DashboardLayout from "../../components/DashboardLayout";

const QRCodeDisplay = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [selectedQRCodes, setSelectedQRCodes] = useState([]); //Track selected QR codes
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in local storage");
        }
        const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
          headers: {
            Authorization: `Bearer ${token}`
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
      const fetchQRCodes = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/qr/getAllQRCodes/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`
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

  //Toggle QR Code Selection
  const handleSelection = (qr) => {
    setSelectedQRCodes((prevSelected) => {
      if (prevSelected.includes(qr)) {
        return prevSelected.filter(item => item !== qr);
      } else {
        return [...prevSelected, qr];
      }
    });
  };

  // Print Selected QR Codes
  const handlePrint = () => {
    if (selectedQRCodes.length === 0) {
      alert("Please select at least one QR code to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Print QR Codes</title>
        <style>
          .print-container { text-align: center; padding: 20px; }
          .qr-card { display: inline-block; margin: 10px; text-align: center; }
          .qr-card img { width: 150px; height: 150px; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <h2>Selected QR Codes</h2>
          ${selectedQRCodes.map(qr => `
            <div class="qr-card">
              <img src="${qr.qr_code}" alt="QR Code for Table ${qr.table_number}" />
              <p><b>Table ${qr.table_number}</b></p>
            </div>
          `).join("")}
        </div>
        <script>window.print(); window.onafterprint = () => window.close();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Delete QR Code
  const handleDelete = async (qrId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/qr/deleteQRCode/${qrId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQRCodes(qrCodes.filter(qr => qr.id !== qrId));
      setMessage("QR code deleted successfully!");
    } catch (error) {
      console.error("Error deleting QR code", error);
      setMessage("Error deleting QR code");
    }
  };

  return (
    <DashboardLayout>
      <div className="qr-display">
        <h1>All Generated QR Codes</h1>

        {qrCodes.length > 0 && (
          <div className="button-group">
            <button className="print-button" onClick={handlePrint}>
              Print Selected QR Codes
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete Selected QR Codes
            </button>
          </div>

        )}

        <div className="qr-list">
          {qrCodes.length === 0 ? (
            <p>No QR codes generated yet.</p>
          ) : (
            qrCodes.map((qr, index) => (
              <div key={index} className="qr-item">
                <input
                  type="checkbox"
                  onChange={() => handleSelection(qr)}
                  checked={selectedQRCodes.includes(qr)}
                />
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
