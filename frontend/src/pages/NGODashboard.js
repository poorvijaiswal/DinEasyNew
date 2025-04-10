// --- Frontend: NGO Dashboard (React + Tailwind CSS) ---
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NGODashboard() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const ngoId = 1; // Static NGO ID for demonstration. Replace with logged-in NGO's ID.

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food_tokens?status=pending"); // Updated to match backend route
      setTokens(res.data);
    } catch (error) {
      console.error("Failed to fetch tokens", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const respondToToken = async (tokenId, status) => {
    try {
      const response = await axios.post("http://localhost:5000/api/token_responses", {
        token_id: tokenId,
        ngo_id: ngoId, // Ensure this is from the logged-in NGO
        status,
      });
  
      // If successful, update the local state by removing the responded token
      setTokens((prev) => prev.filter((t) => t.token_id !== tokenId));
    } catch (error) {
      console.error("Error responding to token:", error.response?.data || error.message);
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">NGO Dashboard</h1>
      {tokens.length === 0 ? (
        <p className="text-center text-gray-500">No food tokens available.</p>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">
                {token.food_item} ({token.quantity})
              </h2>
              <p>
                <strong>Pickup Location:</strong> {token.pickup_location}
              </p>
              <p>
                <strong>Expires At:</strong>{" "}
                {new Date(token.expiry_time).toLocaleString()}
              </p>
              <div className="flex gap-4 mt-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => respondToToken(token.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => respondToToken(token.id, "declined")}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}