import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RaiseTokenPage.css"; // Ensure this CSS file exists

const RaiseTokenPage = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    foodItem: "",
    quantity: 1,
    unit: "kg",
    pickupLocation: "",
    expiryTime: "",
  });

  const navigate = useNavigate();

  // 🔁 Fetch restaurant_id from backend using token
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurantId(response.data.restaurant_id);
      } catch (err) {
        console.error("Error fetching restaurant ID", err);
        setError("❌ Failed to fetch restaurant ID");
      }
    };

    fetchRestaurantId();
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
      setError("Restaurant ID not loaded.");
      return;
    }

    const { foodItem, quantity, unit, pickupLocation, expiryTime } = formData;

    try {
      await axios.post("http://localhost:5000/api/token", {
        restaurant_id: restaurantId,
        food_item: foodItem,
        quantity: parseInt(quantity),
        unit,
        pickup_location: pickupLocation,
        expiry_time: expiryTime,
      });

      setFormData({
        foodItem: "",
        quantity: 1,
        unit: "kg",
        pickupLocation: "",
        expiryTime: "",
      });

      setError("");
      alert(" Token successfully created!");
      navigate("/ngo-dashboard"); 
    } catch (err) {
      console.error("Error creating token:", err);
      setError(" Error creating token.");
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
          <select
            id="unit"
            value={formData.unit}
            onChange={handleFormChange}
          >
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="packs">packs</option>
            <option value="pieces">pieces</option>
            <option value="other">other quantity</option>
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
