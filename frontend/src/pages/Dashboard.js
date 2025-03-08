import React, { useState } from "react";
import { Link } from "react-router-dom"; // Add this line
import { FaBars, FaSignOutAlt, FaChartBar, FaClipboardList, FaUserCog, FaQrcode, FaHome, FaUser } from "react-icons/fa";

export default function Dashboard() {
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
      <div className={`pt-7 flex-1 flex flex-col transition-all duration-300 ${isNavOpen ? "ml-50" : "ml-16"} p-6`}>
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
          <h2 className="text-2xl font-semibold text-gray-800">Welcome to the Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Manage your restaurant operations here. Track orders, manage staff, and analyze sales.
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h3 className="text-lg font-bold">Total Sales</h3>
              <p className="text-2xl font-semibold">₹1,25,000</p>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h3 className="text-lg font-bold">Active Orders</h3>
              <p className="text-2xl font-semibold">42</p>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h3 className="text-lg font-bold">Pending Deliveries</h3>
              <p className="text-2xl font-semibold">7</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

