import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaSpinner, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for page navigation
import "./StaffDashboard.css"; // Import the CSS file

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark this order as ${status}?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/order/${id}`, { status });
      fetchOrders();
    } catch (err) {
      setError("Error updating order.");
      console.error("Error updating order:", err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/order/${id}`);
      fetchOrders();
    } catch (err) {
      setError("Error deleting order.");
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Staff Order Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

      {/* "Raise a Token" Button */}
      <button
        className="btn btn-raise-token"
        onClick={() => navigate("/raise-token")} // Navigate to the new page
      >
        Raise a Token
      </button>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table No</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.table_number}</td>
                  <td className="item-list">
                    {order.items.map(item => (
                      <div key={item.order_item_id}>
                        {item.quantity} x {item.menu_name} - ₹{item.price}
                      </div>
                    ))}
                  </td>
                  <td className="price-cell">
                    ₹{order.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                  </td>
                  <td className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>
                    {order.status}
                  </td>
                  <td>
                    {order.status !== "In Progress" && (
                      <button
                        className="btn btn-progress"
                        onClick={() => updateStatus(order.order_id, "In Progress")}
                      >
                        <FaSpinner /> In Progress
                      </button>
                    )}
                    {order.status !== "Completed" && (
                      <button
                        className="btn btn-complete"
                        onClick={() => updateStatus(order.order_id, "Completed")}
                      >
                        <FaCheck /> Complete
                      </button>
                    )}
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteOrder(order.order_id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;
