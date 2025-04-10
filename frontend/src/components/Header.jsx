"use client"

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {jwtDecode} from "jwt-decode";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);

        if (location.pathname === '/login' || location.pathname === '/register') {
          if (decodedToken.role === 'owner') {
            navigate('/dashboard/owner');
          } else if (decodedToken.role === 'staff') {
            navigate('/dashboard/staff');
          }
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-indigo-100 shadow-sm fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              DinEasy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/partners" className="text-gray-700 hover:text-blue-600">
              Partner Restaurants
            </Link>
            {isAuthenticated && userRole && (
              <>
                <Link to={`/dashboard/${userRole}`} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
              </>
            )}
            <Link
                  to="/ngo-login"
                  className="px-4 py-2 text-white border bg-blue-600 border-gray-700 rounded hover:bg-blue-800"
                >
                  NGO
            </Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="px-4 py-2 text-white border bg-blue-600 border-gray-700 rounded hover:bg-blue-800">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-white border bg-blue-600 border-gray-700 rounded hover:bg-blue-800">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Register Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden p-4 fixed top-16 inset-0 bg-white z-10 h-min shadow-inner">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link to="/partners" className="text-gray-700 hover:text-blue-600">
                Partner Restaurants
              </Link>
              {isAuthenticated && userRole && (
                <>
                  <Link to={`/dashboard/${userRole}`} className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link
                    to="/ngo"
                    className="px-4 py-2 text-white border bg-blue-600 border-gray-700 rounded hover:bg-blue-800 text-center"
                  >
                    NGO
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="px-4 py-2 text-white border bg-blue-600 border-gray-700 rounded hover:bg-blue-800">
                  Logout
                </button>
              ) : (
                <>
                 <Link to="/login" className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 text-center">
                    Login
                  </Link>
                  <Link to="/register" className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-center">
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}