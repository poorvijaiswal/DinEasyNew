import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerOwner } from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
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
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await registerOwner({
        owner_name: formData.owner_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (response.status === 201) {
        setMessage("Registration successful!");
        setFormData({
          owner_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
        });
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        setError(response.data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error connecting to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper =
    "flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white";
  const inputField =
    "w-full outline-none bg-transparent text-gray-800 placeholder-gray-400";

  return (
    <div
      className="flex justify-center items-center min-h-screen max-h-screen bg-cover bg-center bg-gray-100 p-4"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row max-h-full overflow-auto">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-gray-800">
            Sign up
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className={inputWrapper}>
              <FaUser className="text-red-500 mr-2" />
              <input
                type="text"
                id="owner_name"
                placeholder="Owner Name"
                className={inputField}
                value={formData.owner_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={inputWrapper}>
              <FaEnvelope className="text-red-500 mr-2" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                className={inputField}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={inputWrapper}>
              <FaLock className="text-red-500 mr-2" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                className={inputField}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={inputWrapper}>
              <FaLock className="text-red-500 mr-2" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                className={inputField}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className={inputWrapper}>
              <FaPhone className="text-red-500 mr-2" />
              <input
                type="tel"
                id="phone"
                placeholder="Phone Number"
                className={inputField}
                value={formData.phone}
                onChange={handleChange}
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
            className="w-[500px] h-[360px] rounded-2xl object-cover"
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
