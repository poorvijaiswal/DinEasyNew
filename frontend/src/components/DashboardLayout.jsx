import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome, FaUser } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="pt-16 flex h-screen">
      {/* Sidebar */}
      <div className={`bg-blue-900 text-white h-full transition-all duration-300 fixed top-16 ${isNavOpen ? "w-58" : "w-16"}`}>
        <div className="p-4 flex items-center justify-between">
          <button className="text-white text-2xl" onClick={() => setIsNavOpen(!isNavOpen)}>
            <FaBars />
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          <Link to="/dashboard/owner" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaHome className="mr-2" /> {isNavOpen && "Dashboard"}
            {!isNavOpen && <span className="tooltip">Dashboard</span>}
          </Link>
          <Link to="/sales" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaChartBar className="mr-2" /> {isNavOpen && "Total Sales"}
            {!isNavOpen && <span className="tooltip">Total Sales</span>}
          </Link>
          <Link to="/menu" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaClipboardList className="mr-2" /> {isNavOpen && "Create Menu"}
            {!isNavOpen && <span className="tooltip">Create Menu</span>}
          </Link>
          <Link to="/menu-display" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaClipboardList className="mr-2" /> {isNavOpen && "Display MenuList"}
            {!isNavOpen && <span className="tooltip">Display MenuList</span>}
          </Link>
          <Link to="/manage-staff" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaUserCog className="mr-2" /> {isNavOpen && "Manage Staff"}
            {!isNavOpen && <span className="tooltip">Manage Staff</span>}
          </Link>
          <Link to="/generate-qr" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaQrcode className="mr-2" /> {isNavOpen && "Generate QR"}
            {!isNavOpen && <span className="tooltip">Generate QR</span>}
          </Link>
          <Link to="/display-qr" className="flex items-center px-4 py-2 hover:bg-blue-700 transition-all relative group">
            <FaQrcode className="mr-2" /> {isNavOpen && "Display QR"}
            {!isNavOpen && <span className="tooltip">Display QR</span>}
          </Link>
          <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-red-600 transition-all mt-4 relative group">
            <FaSignOutAlt className="mr-2" /> {isNavOpen && "Sign Out"}
            {!isNavOpen && <span className="tooltip">Sign Out</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isNavOpen ? "ml-58" : "ml-16"} p-6`} style={{ marginLeft: isNavOpen ? '14.5rem' : '4rem' }}>
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