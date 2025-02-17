import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await verifyEmail({ email, verificationCode });

      if (response.status === 200) {
        setMessage("Email verified successfully!");
        navigate('/login');
      } else {
        setError(response.data.message || "Verification failed. Try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 max-h-screen flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
            Verify Email
          </h2>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="verificationCode"
              placeholder="Verification Code"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={verificationCode}
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
        </div>

        {/* Right Section - Illustration & Links */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2">
          <img
            src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1"
            alt="Verification Illustration"
            className="w-[500px] h-[360px] rounded-2xl"
          />
          <p className="mt-4 text-gray-600 text-center">
            Didn't receive the code?{" "}
            <a href="/resend-code" className="text-blue-600 hover:underline">
              Resend Code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}