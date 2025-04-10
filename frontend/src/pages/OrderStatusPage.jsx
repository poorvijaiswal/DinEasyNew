import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderStatusPage.css";
import axios from "axios";

const OrderStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState({
    order_id: null,
    items: [],
    table_number: "Unknown",
    total_price: 0,
    status: "Pending", // Default status
  });

  const { order_id } = location.state || { order_id: null };

  useEffect(() => {
    if (order_id) {
      // Fetch order details from the backend
      axios
        .get(`http://localhost:5000/api/order/${order_id}`)
        .then((response) => {
          setOrderDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
          alert("Failed to fetch order details.");
        });
    }
  }, [order_id]);

  return (
    <div className="order-status-container">
      <h1 className="order-status-title">Order Status</h1>

      <div className="order-details">
        <h2>Order ID: {orderDetails.order_id || "Not Found"}</h2>
        <h3>Table Number: {orderDetails.table_number}</h3>
        <h3>Order Status: {orderDetails.status}</h3>
        <h3>Total Price: {"\u20B9"}{orderDetails.total_price ? orderDetails.total_price.toFixed(2) : "0.00"}</h3>

        <div className="order-items">
          <h3>Order Items:</h3>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <p>
                  <strong>{item.name}</strong> (x{item.quantity})
                </p>
                <p>Price: {"\u20B9"}{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p>No items found in the order.</p>
          )}
        </div>
      </div>

      <button
        className="feedback-button"
        onClick={() => navigate("/feedback", { state: { order_id } })}
      >
        Give Feedback
      </button>
    </div>
  );
};

export default OrderStatusPage;