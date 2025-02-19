import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./QRCodeGenerator.css"; // Import the CSS file
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome } from "react-icons/fa";

const QRCodeGenerator = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [qrCode, setQRCode] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [size, setSize] = useState(300);
  const [message, setMessage] = useState("");

  const generateQR = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/qr/generate", { tableNumber, size });
      setQRCode(response.data.qrCode);
      setMessage("QR Code successfully created!");
    } catch (error) {
      console.error("Error generating QR code", error);
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("");
      }
    }
  };

  return (
    <div className="qr-container">
      {/* Sidebar */}
      <div className={`sidebar ${isNavOpen ? "w-58" : "w-16"}`}>
        <div className="p-4 flex items-center justify-between">
          <button className="text-white text-2xl" onClick={() => setIsNavOpen(!isNavOpen)}>
            <FaBars />
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          <a href="/dashboard" className="nav_link">
            <FaHome className="nav_icon" /> {isNavOpen && "Dashboard"}
          </a>
          <a href="/sales" className="nav_link">
            <FaChartBar className="nav_icon" /> {isNavOpen && "Total Sales"}
          </a>
          <a href="/createmenu" className="nav_link">
            <FaClipboardList className="nav_icon" /> {isNavOpen && "Create Menu"}
          </a>
          <a href="/manage-staff" className="nav_link">
            <FaUserCog className="nav_icon" /> {isNavOpen && "Manage Staff"}
          </a>
          <a href="/generate-qr" className="nav_link">
            <FaQrcode className="nav_icon" /> {isNavOpen && "Generate QR"}
          </a>
          <a href="/display-qr" className="nav_link">
            <FaQrcode className="nav_icon" /> {isNavOpen && "Display QR"}
          </a>
          <a href="/logout" className="nav_link hover:bg-red-600 mt-4">
            <FaSignOutAlt className="nav_icon" /> {isNavOpen && "Sign Out"}
          </a>
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
          {qrCode && (
            <div className="qr-code-container">
              <QRCodeCanvas value={qrCode} size={size} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;