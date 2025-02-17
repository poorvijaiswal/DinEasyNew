import React, { useState } from "react";
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome, FaUser } from "react-icons/fa";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-900 text-white w-64 transition-all duration-300 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dineazy</h2>
          <button className="text-white md:hidden" onClick={() => setIsSidebarOpen(false)}>✖</button>
        </div>
        <nav className="mt-4">
          <a href="/dashboard" className="flex items-center px-4 py-2 hover:bg-blue-700">
            <FaHome className="mr-2" /> Dashboard
          </a>
          <a href="/sales" className="flex items-center px-4 py-2 hover:bg-blue-700">
            <FaChartBar className="mr-2" /> Total Sales
          </a>
          <a href="/createmenu" className="flex items-center px-4 py-2 hover:bg-blue-700">
            <FaClipboardList className="mr-2" /> Create Menu
          </a>
          <a href="/manage-staff" className="flex items-center px-4 py-2 hover:bg-blue-700">
            <FaUserCog className="mr-2" /> Manage Staff
          </a>
          <a href="/generateqr" className="flex items-center px-4 py-2 hover:bg-blue-700">
            <FaQrcode className="mr-2" /> Generate QR
          </a>
          <a href="/logout" className="flex items-center px-4 py-2 hover:bg-red-600 mt-4">
            <FaSignOutAlt className="mr-2" /> Sign Out
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button className="text-gray-700 text-2xl md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          {/* Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FaUser className="text-gray-600 text-2xl" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-200">Change Profile</a>
                <a href="/logout" className="block px-4 py-2 hover:bg-red-500 hover:text-white">Logout</a>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold">Welcome to the Dashboard</h2>
          <p className="mt-2 text-gray-600">Manage your restaurant operations here.</p>
        </main>
      </div>
    </div>
  );
}
