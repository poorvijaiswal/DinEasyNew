import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RaiseTokenPage.css"; // Ensure this CSS file exists

const RaiseTokenPage = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantAddress, setRestaurantAddress] = useState(""); // State for restaurant address
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    foodItem: "",
    quantity: 1,
    unit: "kg",
    pickupLocation: "",
    expiryTime: "",
  });

  const navigate = useNavigate();

  // Fetch restaurant_id and address from backend using token
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Fetch restaurant_id
        const restaurantIdResponse = await axios.get(
          "http://localhost:5000/api/auth/getRestaurantId",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const restaurantId = restaurantIdResponse.data.restaurant_id;
        setRestaurantId(restaurantId);

        // Fetch restaurant address
        const restaurantDetailsResponse = await axios.get(
          `http://localhost:5000/api/restaurant/getRestaurantDetails?restaurant_id=${restaurantId}`
        );

        const { address } = restaurantDetailsResponse.data;
        setRestaurantAddress(address);

        // Pre-fill the pickup location with the restaurant address
        setFormData((prev) => ({
          ...prev,
          pickupLocation: address,
        }));
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError("Failed to fetch restaurant details.");
      }
    };

    fetchRestaurantDetails();
  }, []);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const createToken = async () => {
    if (!restaurantId) {
      setError("Restaurant ID is not available.");
      return;
    }

    const { foodItem, quantity, unit, pickupLocation, expiryTime } = formData;

    try {
      await axios.post(
        "http://localhost:5000/api/token",
        {
          restaurant_id: restaurantId,
          food_item: foodItem,
          quantity: parseInt(quantity),
          unit,
          pickup_location: pickupLocation,
          expiry_time: expiryTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token in the Authorization header
          },
        }
      );

      setFormData({
        foodItem: "",
        quantity: 1,
        unit: "kg",
        pickupLocation: restaurantAddress, // Reset to restaurant address
        expiryTime: "",
      });

      setError("");
      alert("Token successfully created!");
      navigate("/ngo-dashboard");
    } catch (err) {
      console.error("Error creating token:", err);
      setError("Error creating token.");
    }
  };

  return (
    <div className="token-form-container">
      <h2>Create Token</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="foodItem">Food Item</label>
        <input
          type="text"
          id="foodItem"
          value={formData.foodItem}
          onChange={handleFormChange}
          placeholder="Enter food item"
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <div className="quantity-unit-wrapper">
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={handleFormChange}
            min="1"
          />
          <select id="unit" value={formData.unit} onChange={handleFormChange}>
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="packs">packs</option>
            <option value="pieces">pieces</option>
            <option value="grams">grams</option>
            <option value="plates">plates</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="pickupLocation">Pickup Location</label>
        <input
          type="text"
          id="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleFormChange}
          placeholder="Enter pickup location"
        />
      </div>

      <div className="form-group">
        <label htmlFor="expiryTime">Expiry Time</label>
        <input
          type="datetime-local"
          id="expiryTime"
          value={formData.expiryTime}
          onChange={handleFormChange}
        />
      </div>

      <button className="btn btn-submit" onClick={createToken}>
        Create Token
      </button>
    </div>
  );
};

export default RaiseTokenPage;