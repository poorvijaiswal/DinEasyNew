import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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
      <div className="bg-white p-14 rounded-2xl shadow-lg max-w-4xl w-full flex mt-0 mx-6 mb-10">
        {/* Left Section - Image */}
        <div className="w-1/2 flex flex-col items-center justify-center p-6">
          <img
            src="https://img.freepik.com/premium-vector/restaurant-staff-team-director-chef-waiter-manager-sommelier_369750-595.jpg"
            alt="Staff Illustration"
            className="w-66 rounded-2xl h-auto mb-4"
          />
          <p className="text-gray-600">
            <a href="/signup" className="text-blue-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Staff Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="text-gray-600">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white py-3 rounded-lg w-full hover:bg-red-600 transition"
            >
              Log In
            </button>
          </form>

          {/* Social Login */}
          <p className="text-gray-600 text-center mt-4">Or login with</p>
          <div className="flex justify-center gap-3 mt-2">
            <a
              href="https://www.facebook.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-xl cursor-pointer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xl cursor-pointer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://accounts.google.com/signin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 text-xl cursor-pointer"
            >
              <FaGoogle />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
