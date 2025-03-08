import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome, FaUser } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="pt-16 flex h-screen bg-gray-100">
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
          <Link to="/menu" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all">
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
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isNavOpen ? "ml-50" : "ml-16"} p-6`}>
        {/* Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="relative">
            <button className="flex items-center space-x-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FaUser className="text-gray-600 text-2xl" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Change Profile</Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-red-500 hover:text-white">Logout</Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-lg p-6 mt-4">
          {children}
        </main>
      </div>
    </div>
  );
}