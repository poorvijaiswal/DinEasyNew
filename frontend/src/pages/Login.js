import React, { useState, useRef } from "react";
import axios from "axios";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const verificationRef = useRef(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      if (response.data.requiresVerification) {
        setShowVerification(true);
        setTimeout(() => verificationRef.current?.focus(), 100); // Auto-focus verification input
      } else {
        setMessage("Login successful");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify", {
        email: formData.email,
        verificationCode,
      });
      setMessage(response.data.message);
      setShowVerification(false);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-14 rounded-2xl shadow-lg max-w-4xl w-full flex mt-0 mx-6 mb-10">
        <div className="w-1/2 flex flex-col items-center justify-center p-9">
          <img
            src="https://img.freepik.com/premium-vector/restaurant-staff-team-director-chef-waiter-manager-sommelier_369750-595.jpg"
            alt="Staff Illustration"
            className="w-66 rounded-2xl h-auto mb-4"
          />
          <p className="text-gray-600">
            <a href="/Register" className="text-blue-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>

        <div className="w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Staff Login</h2>
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {!showVerification ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Verification Code"
                className="border p-3 rounded-lg w-full"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                ref={verificationRef}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          )}

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
