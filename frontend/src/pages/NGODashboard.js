import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NGODashboard() {
  const [tokens, setTokens] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [messages, setMessages] = useState({}); // Store messages per token

  const ngoId = 1;// Replace with dynamic NGO ID when auth is implemented

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/restaurant");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Error fetching restaurants.");
    }
  };

  const fetchTokens = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food_tokens?status=pending");
      setTokens(res.data);
    } catch (error) {
      console.error("Failed to fetch tokens", error.message || error);
      setError("Failed to fetch tokens.");
    } finally {
      setLoading(false);
    }
  };

  const respondToToken = async (tokenId, status) => {
    const token = tokens.find((t) => t.token_id === tokenId);
    const message = messages[tokenId] || "";
  
    const payload = {
      token_id: tokenId,
      ngo_id: ngoId,
      status,
      message,
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await axios.post("http://localhost:5000/api/token_responses", payload);
      console.log("Response from server:", response.data);
  
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
  
      if (status === "accepted") {
        const time = new Date(token.expiry_time).toLocaleString();
        alert(`Thank you for accepting the request!\nPlease pick up by: ${time}\nMessage sent: "${message}"`);
      } else {
        alert("You have declined the request.");
      }
    } catch (error) {
      console.error("Error responding to token:", error.response?.data || error.message);
      alert("Failed to respond to the token. Please try again.");
    }
  };
  useEffect(() => {
    fetchRestaurants();
    fetchTokens();
  }, []);

  const filteredTokens = selectedRestaurantId
    ? tokens.filter((t) => t.restaurant_id === selectedRestaurantId)
    : tokens;

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-9">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-gray-900 tracking-wide">
        NGO Dashboard
      </h1>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Restaurants List */}
        <div className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Registered Restaurants</h2>
          {restaurants.length === 0 ? (
            <p className="text-gray-500">No restaurants registered.</p>
          ) : (
            <ul className="space-y-4">
              {restaurants.map((restaurant) => {
                const tokenCount = tokens.filter(
                  (t) => t.restaurant_id === restaurant.restaurant_id
                ).length;

                return (
                  <li
                    key={restaurant.restaurant_id}
                    onClick={() =>
                      setSelectedRestaurantId(
                        selectedRestaurantId === restaurant.restaurant_id ? null : restaurant.restaurant_id
                      )
                    }
                    className={`relative cursor-pointer bg-gray-50 p-4 rounded-md border hover:shadow transition ${
                      selectedRestaurantId === restaurant.restaurant_id ? "border-red-500 ring-2 ring-red-400" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">{restaurant.email}</p>
                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                      </div>
                      {tokenCount > 0 && (
                        <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                          {tokenCount} Request{tokenCount > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Food Tokens List */}
        <div className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            {selectedRestaurantId ? "Food Requests from Selected Restaurant" : "All Food Requests"}
          </h2>
          {filteredTokens.length === 0 ? (
            <p className="text-gray-500 text-center">No food tokens available.</p>
          ) : (
            <div className="space-y-6">
              {filteredTokens.map((token) => {
                const restaurant = restaurants.find((r) => r.restaurant_id === token.restaurant_id);

                return (
                  <div
                    key={token.id}
                    className="p-5 bg-gray-50 border rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {token.food_item} ({token.quantity})
                    </h3>

                    {restaurant && (
                      <p className="text-sm text-blue-700 font-medium mt-1">
                        From: {restaurant.name}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Pickup Location:</strong> {token.pickup_location}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Expires At:</strong>{" "}
                      {new Date(token.expiry_time).toLocaleString()}
                    </p>

                    <textarea
                      rows={2}
                      placeholder="Enter your message to the restaurant..."
                      className="w-full mt-3 p-2 border rounded-md text-sm"
                      value={messages[token.token_id] || ""}
                      onChange={(e) =>
                        setMessages((prev) => ({ ...prev, [token.token_id]: e.target.value }))
                      }
                    />

                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={() => respondToToken(token.token_id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => respondToToken(token.token_id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
