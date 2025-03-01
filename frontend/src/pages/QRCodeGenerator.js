import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./QRCodeGenerator.css";
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome } from "react-icons/fa";

const QRCodeGenerator = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [qrCode, setQRCode] = useState("");  // Ensure it's a string, not null
  const [tableNumber, setTableNumber] = useState("");
  const [size, setSize] = useState(300);
  const [restaurantId, setRestaurantId] = useState(""); // Add restaurantId state
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

  const generateQR = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found in local storage");
      }
      const response = await axios.post("http://localhost:5000/api/qr/generate", { tableNumber, size, restaurantId }, {
        headers: {
          Authorization: `Bearer ${token}` // Ensure no double quotes around the token
        }
      });
      
      console.log("QR Code Data:", response.data.qrCode); // Debugging step
      
      if (response.data.qrCode) {
        setQRCode(response.data.qrCode);
        setMessage("QR Code successfully created!");
      } else {
        setMessage("Failed to generate QR Code.");
      }
    } catch (error) {
      console.error("Error generating QR code", error);
      setMessage("Error generating QR Code");
    }
  };
  
  useEffect(() => {
    console.log("Updated QR Code Data:", qrCode); // Log QR code whenever it updates
  }, [qrCode]);

  return (
    <div className="qr-container">
      {/* Sidebar */}
      <div className={`bg-blue-900 text-white h-full transition-all duration-300 ${isNavOpen ? "w-58" : "w-16"}`}>
        <div className="p-4 flex items-center justify-between">
          <button className="text-white text-2xl" onClick={() => setIsNavOpen(!isNavOpen)}>
            <FaBars />
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaHome className="mr-2" /> {isNavOpen && "Dashboard"}
          </Link>
          <Link to="/sales" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaChartBar className="mr-2" /> {isNavOpen && "Total Sales"}
          </Link>
          <Link to="/createmenu" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaClipboardList className="mr-2" /> {isNavOpen && "Create Menu"}
          </Link>
          <Link to="/manage-staff" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaUserCog className="mr-2" /> {isNavOpen && "Manage Staff"}
          </Link>
          <Link to="/generate-qr" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaQrcode className="mr-2" /> {isNavOpen && "Generate QR"}
          </Link>
          <Link to="/display-qr" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
            <FaQrcode className="mr-2" /> {isNavOpen && "Display QR"}
          </Link>
          <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-red-600 transition-all mt-4">
            <FaSignOutAlt className="mr-2" /> {isNavOpen && "Sign Out"}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="form-container">
          <h1>QR Code Generator</h1>
          <form id="generate-form" onSubmit={generateQR}>
            <input
              name="tno"
              type="text"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
            <select
              name="size"
              id="size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value="100">100x100</option>
              <option value="200">200x200</option>
              <option value="300">300x300</option>
              <option value="400">400x400</option>
              <option value="500">500x500</option>
              <option value="600">600x600</option>
              <option value="700">700x700</option>
            </select>
            <p className="msg" style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>
            <button type="submit">
              Generate QR Code
            </button>
          </form>

          {/* Display QR Code */}
          {qrCode && (
            <div className="qr-code-container">
               <p>QR Code for Table {tableNumber}</p>
              <QRCodeCanvas value={qrCode} size={size} />
            </div>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;