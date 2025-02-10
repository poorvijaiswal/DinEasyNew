import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl w-full flex  mt-0 mx-6 mb-8 ">
        {/* Left Section - Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-6">Sign up</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat your password"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="termsAccepted"
                className="mr-2"
                onChange={handleChange}
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
            >
              Register
            </button>
          </form>
        </div>

        {/* Right Section - Illustration & Links */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <img
            src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1"
            alt="Signup Illustration"
            className="w-88 h-66"
          />
          <p className="mt-4 text-gray-600">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
          <Link
            to="/membership"
            className="text-sm text-blue-600 hover:underline"
          >
            Take a Membership for your Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
}
