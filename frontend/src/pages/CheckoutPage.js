import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const [restaurantId, setRestaurantId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch restaurant_id dynamically from backend
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in local storage");
        }
        const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurantId(response.data.restaurant_id);
      } catch (error) {
        console.error("Error fetching restaurant ID:", error);
        setErrorMessage("Error fetching restaurant ID");
      }
    };

    fetchRestaurantId();
  }, []);

  // ✅ Function to confirm order
  const handleConfirmOrder = async () => {
    try {
      if (!Array.isArray(cart) || cart.length === 0) {
        alert("Cart is empty!");
        return;
      }
      if (!restaurantId) {
        alert("Restaurant ID is not available yet. Please try again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          table_number: 1, // Static or user-selected table number
          restaurant_id: restaurantId, // Dynamically fetched restaurant ID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(" Order placed successfully!");
        localStorage.removeItem("cart");
        navigate("/dashboard/staff");
      } else {
        alert(" Failed to place order: " + data.message);
      }
    } catch (error) {
      alert(" Something went wrong!");
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="cart-summary">
        {cart.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="checkout-image" />
            <div>
              <h2>{item.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {"\u20B9"}{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="checkout-total">Total: {"\u20B9"}{totalPrice.toFixed(2)}</h2>

      <button className="confirm-order" onClick={handleConfirmOrder} disabled={!restaurantId}>
        Confirm Order
      </button>

      <button className="back-to-cart" onClick={() => navigate("/cart")}>
        Back to Cart
      </button>
    </div>
  );
};

export default CheckoutPage;

