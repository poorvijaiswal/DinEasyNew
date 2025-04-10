import React, { useState, useRef } from "react";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verificationRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters, contain a number, a letter, and a special character.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, membership_id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("membership_id", membership_id);

      if (response.data.requiresVerification) {
        setShowVerification(true);
        setTimeout(() => verificationRef.current?.focus(), 100);
        navigate('/verify-email', { state: { email: formData.email } });
      } else if (response.data.requiresMembershipRenewal) {
        setMessage("Membership expired, please renew your membership.");
        navigate('/select-membership');
      } else if (response.data.requiresRestaurantRegistration) {
        setMessage("Login successful, please register your restaurant.");
        navigate('/restaurant-register');
      } else {
        setMessage("Login successful.");
        navigate('/dashboard/owner');
      }
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message === 'Please verify your email. A new verification code has been sent to your email.'
      ) {
        setMessage(err.response.data.message);
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: resetEmail });
      setMessage(response.data.message || "Password reset link sent to your email.");
      setShowForgotPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        
        {/* Left Side */}
        <div className="md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6">
          <img
            src="https://img.freepik.com/premium-vector/restaurant-staff-team-director-chef-waiter-manager-sommelier_369750-595.jpg"
            alt="Staff"
            className="w-64 h-auto rounded-xl mb-4"
          />
          <div className="text-sm text-gray-700 space-y-2 text-center">
            <a href="/Register" className="text-blue-500 hover:underline block">Create an account</a>
            <a href="/staff-login" className="text-blue-600 hover:underline font-medium">Staff Login</a>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-1/2 p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Owner Login</h2>

          {message && <p className="text-green-600 text-sm text-center mb-2">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 p-3 rounded-lg w-full"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-500 text-center hover:underline text-xs block w-full"
              >
                Back to Login
              </button>
            </form>
          ) : !showVerification ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full outline-none text-sm"
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
                  placeholder="Password"
                  className="w-full outline-none text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-blue-500 hover:underline font-medium"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
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
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter Verification Code"
                className="border border-gray-300 p-3 rounded-lg w-full"
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
        </div>
      </div>
    </div>
  );
}
