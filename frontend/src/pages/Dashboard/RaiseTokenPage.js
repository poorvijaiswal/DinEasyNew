import React, { useState } from "react";
import axios from "axios";
import "./RaiseTokenPage.css"; // make sure this file exists

const RaiseTokenPage = () => {
  const [formData, setFormData] = useState({
    foodItem: "",
    quantity: 1,
    unit: "kg",
    pickupLocation: "",
    expiryTime: "",
  });

  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const createToken = async () => {
    const restaurantId = 1; // Static value for now

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
      alert("✅ Token successfully created!");
    } catch (err) {
      setError("❌ Error creating token.");
      console.error("Error creating token:", err);
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
