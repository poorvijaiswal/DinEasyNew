import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderStatusPage.css";

const OrderStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Assuming order details are passed via state
  const { order_id, items, table_number, total_price } = location.state || {
    order_id: null,
    items: [],
    table_number: "Unknown",
    total_price: 0,
  };

  return (
    <div className="order-status-container">
      <h1 className="order-status-title">Order Status</h1>

      <div className="order-details">
        <h2>Order ID: {order_id || "Not Found"}</h2>
        <h3>Table Number: {table_number}</h3>
        <h3>Total Price: {"\u20B9"}{total_price.toFixed(2)}</h3>

        <div className="order-items">
          <h3>Order Items:</h3>
          {items.length > 0 ? (
            items.map((item, index) => (
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