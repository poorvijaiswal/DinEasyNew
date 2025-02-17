import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaQrcode, FaUserCog, FaSignOutAlt, FaChartBar, FaUtensils } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

export default function Dashboard() {
  const [role, setRole] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const roleCookie = getCookie('position');
    setRole(roleCookie);
  }, []);

  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-blue-900 text-white transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:flex-col md:w-64`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-700">
          <h2 className="text-xl font-bold">Dineazy</h2>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <nav className="flex-1 px-2 py-4">
          <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
            <MdDashboard className="mr-3" /> Dashboard
          </Link>
          {role !== 'Staff' && (
            <Link to="/sales" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
              <FaChartBar className="mr-3" /> Total Sales
            </Link>
          )}
          {role !== 'Staff' && (
            <Link to="/createmenu" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
              <FaUtensils className="mr-3" /> Create Menu
            </Link>
          )}
          {role !== 'Staff' && (
            <Link to="/view" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
              <FaUserCog className="mr-3" /> Manage Staff
            </Link>
          )}
          <Link to="/generateqr" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
            <FaQrcode className="mr-3" /> Generate QR
          </Link>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded">
            <FaSignOutAlt className="mr-3" /> Sign Out
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <button className="md:hidden text-blue-900 text-2xl" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <h2>Main Components Here</h2>
        </main>
      </div>
    </div>
  );
}
