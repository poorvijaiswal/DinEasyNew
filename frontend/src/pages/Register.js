import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerOwner } from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

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

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long, contain a number, a letter, and a special character.");
      return;
    }

    setLoading(true);

    try {
      const { status } = await registerOwner({
        owner_name: formData.owner_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (status === 201) {
        setMessage("Registration successful!");
        setFormData({
          owner_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
        });
        navigate("/verify-email", { state: { email: formData.email } });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border border-gray-300 p-3 rounded-lg w-full pl-10 focus:outline-none focus:ring-2 focus:ring-red-300";
  const iconClass = "absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center p-4" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')" }}>
      <div className="bg-white w-full max-w-4xl md:flex rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <FaUser className={iconClass} />
              <input type="text" id="owner_name" placeholder="Owner Name" className={inputClass} value={formData.owner_name} onChange={handleChange} required />
            </div>

            <div className="relative">
              <FaEnvelope className={iconClass} />
              <input type="email" id="email" placeholder="Your Email" className={inputClass} value={formData.email} onChange={handleChange} required />
            </div>

            <div className="relative">
              <FaLock className={iconClass} />
              <input type="password" id="password" placeholder="Password" className={inputClass} value={formData.password} onChange={handleChange} required />
            </div>

            <div className="relative">
              <FaLock className={iconClass} />
              <input type="password" id="confirmPassword" placeholder="Repeat your password" className={inputClass} value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="relative">
              <FaPhone className={iconClass} />
              <input type="tel" id="phone" placeholder="Phone Number" className={inputClass} value={formData.phone} onChange={handleChange} required />
            </div>

            <button type="submit" className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {/* Right: Image + Links */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6">
          <img src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1" alt="Signup" className="w-full max-w-xs md:max-w-sm rounded-xl mb-6" />
          <p className="text-gray-600 text-sm text-center">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
          <Link to="/membership" className="mt-2 text-sm text-blue-600 hover:underline">
            Take a Membership for your Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
}
