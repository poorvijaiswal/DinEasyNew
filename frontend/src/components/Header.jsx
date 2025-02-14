"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              DinEasy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/partners" className="text-gray-700 hover:text-blue-600">
              Partner Restaurants
            </Link>
            {/* <Link to="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link> */}
            <Link to="/login" className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Register Now
            </Link>
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
          <div className="md:hidden p-4 fixed top-16 inset-0 bg-white z-10 h-80 shadow-inner">
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
              {/* <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link> */}
              <Link to="/login" className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 text-center">
                Login
              </Link>
              <Link to="/register" className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-center">
                Register Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

