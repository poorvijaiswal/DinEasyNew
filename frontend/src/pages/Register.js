
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerOwner } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner_name: "",
    email: "",
    password: "", 
    confirmPassword: "",
    phone: "",
    // start_date: "",
    // end_date: "",
    // termsAccepted: false,
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

    const ownerData = {
      owner_name: formData.owner_name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };
    
    try {
      const response = await registerOwner(ownerData);

      if (response.status === 201) {
        setMessage("Registration successful!");
        setFormData({
          owner_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          // termsAccepted: false,
        });
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setError(response.data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message||"Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
            Sign up
          </h2>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="owner_name"
              placeholder="Owner Name"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.owner_name}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat your password"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.phone}
              required
            />
            {/* <label>Start Date:</label>
            <input
              type="date"
              id="start_date"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.start_date}
              required
            /> */}
            {/* <label>End Date:</label>
            <input
              type="date"
              id="end_date"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.end_date}
              required
            /> */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="termsAccepted"
                className="mr-2"
                onChange={handleChange}
                checked={formData.termsAccepted}
                required
              />
              <label htmlFor="termsAccepted" className="text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
              </label>
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
