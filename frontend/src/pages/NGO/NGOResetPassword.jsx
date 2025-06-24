import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const NGOResetPassword = () => {
  const [searchParams] = useSearchParams(); // Get the token from the query string
  const token = searchParams.get("token"); // Extract the token
  const [password, setPassword] = useState(""); // State for the new password
  const [message, setMessage] = useState(""); // State for success/error messages
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/ngo/reset-password/${token}`,
        { password } // Send the new password
      );
      setMessage("Password reset successful!");
      console.log("Password reset successful:", response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error resetting password.");
      console.error("Error resetting password:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter your new password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NGOResetPassword;