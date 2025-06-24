import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerNgo } from "../services/api"; // Import the API service
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaIdBadge,
} from "react-icons/fa";

export default function NGORegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ngo_name: "", // Matches the backend field "name"
    contact_person: "", // Matches the backend field "contact_person"
    email: "", // Matches the backend field "email"
    password: "", // Matches the backend field "password"
    confirmPassword: "", // Used for validation only
    contact_number: "", // Matches the backend field "phone"
    address: "", // Matches the backend field "address"
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    // Check for empty fields
    if (
      !formData.ngo_name ||
      !formData.contact_person ||
      !formData.email ||
      !formData.password ||
      !formData.contact_number ||
      !formData.address
    ) {
      setError("All fields are required.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, contain a number, a letter, and a special character."
      );
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await registerNgo({
        name: formData.ngo_name,
        contact_person: formData.contact_person,
        email: formData.email,
        password: formData.password,
        contact_number: formData.contact_number,
        address: formData.address,
      });
  
      setMessage(response.message || "Registration successful!");
      setFormData({
        ngo_name: "",
        contact_person: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact_number: "",
        address: "",
      });
  
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/ngo-login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white shadow-sm";

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center py-6 px-4"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')",
      }}
    >
      <div className="bg-white/90 mt-16 w-full max-w-5xl md:flex rounded-2xl shadow-xl overflow-hidden backdrop-blur-md max-h-[95vh]">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            NGO Registration
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm mb-4 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaIdBadge className="text-gray-500 mr-3" />
              <input
                type="text"
                id="ngo_name"
                className="w-full outline-none text-sm"
                placeholder="NGO Name"
                value={formData.ngo_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                id="contact_person"
                className="w-full outline-none text-sm"
                placeholder="Contact Person Name"
                value={formData.contact_person}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                className="w-full outline-none text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                id="password"
                className="w-full outline-none text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full outline-none text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaPhone className="text-gray-500 mr-3" />
              <input
                type="tel"
                id="contact_number"
                className="w-full outline-none text-sm"
                placeholder="Phone Number"
                value={formData.contact_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
              <FaMapMarkerAlt className="text-gray-500 mr-3" />
              <input
                type="text"
                id="address"
                className="w-full outline-none text-sm"
                placeholder="NGO Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 mt-2 font-semibold shadow-md"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {/* Right: Image + Links */}
        <div className="w-full md:w-1/2 bg-red-50 flex flex-col items-center justify-center p-6">
          <img
            src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1"
            alt="Signup"
            className="w-full max-w-xs md:max-w-sm rounded-xl mb-6 shadow-lg"
          />
          <p className="text-gray-700 text-sm text-center">
            Already registered?{" "}
            <Link
              to="/ngo-login"
              className="text-red-600 hover:underline font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}