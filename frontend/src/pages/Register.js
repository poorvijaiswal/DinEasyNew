import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';

export default function Register() {
  const [formData, setFormData] = useState({
    owner_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Registration successful!");
        setFormData({
          owner_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
         
        });
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-gray-100 p-4" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')" }}> 
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row"> 
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
            Sign up
          </h2>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Owner Name */}
            <div className="flex items-center border p-3 rounded-lg w-full">
              <FaUser className="mr-3 text-gray-500" />
              <input
                type="text"
                id="owner_name"
                placeholder="Owner Name"
                className="border-none outline-none w-full"
                onChange={handleChange}
                value={formData.owner_name}
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border p-3 rounded-lg w-full">
              <FaEnvelope className="mr-3 text-gray-500" />
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="border-none outline-none w-full"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border p-3 rounded-lg w-full">
              <FaLock className="mr-3 text-gray-500" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="border-none outline-none w-full"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border p-3 rounded-lg w-full">
              <FaLock className="mr-3 text-gray-500" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repeat your password"
                className="border-none outline-none w-full"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border p-3 rounded-lg w-full">
              <FaPhone className="mr-3 text-gray-500" />
              <input
                type="tel"
                id="phone"
                placeholder="Phone Number"
                className="border-none outline-none w-full"
                onChange={handleChange}
                value={formData.phone}
                required
              />
            </div>
           
            <button
              type="submit"
              className="bg-red-500 text-white py-3 rounded-lg w-full hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {/* Right Section - Illustration & Links */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2">
          <img
            src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1"
            alt="Signup Illustration"
            className="w-[500px] h-[360px] rounded-2xl"
          />
          <p className="mt-4 text-gray-600 text-center">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
          <Link
            to="/membership"
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            Take a Membership for your Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
}
