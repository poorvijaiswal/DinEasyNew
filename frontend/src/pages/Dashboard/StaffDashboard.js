import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaSpinner, FaTrash } from "react-icons/fa"; 

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Error fetching orders:", err);
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark this order as ${status}?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/order/${id}`, { status });
      fetchOrders(); // Refresh list
    } catch (err) {
      setError("Error updating order.");
      console.error("Error updating order:", err);
    }
  };

  // Delete an order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/order/${id}`);
      fetchOrders(); // Refresh list
    } catch (err) {
      setError("Error deleting order.");
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-16 bg-white shadow-lg rounded-xl p-8 w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Staff Order Dashboard</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Order ID</th>
              <th className="border p-3">Table No</th>
              <th className="border p-3">Items</th>
              <th className="border p-3">Total Price</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.order_id} className="border text-center">
                  <td className="border p-3">{order.order_id}</td>
                  <td className="border p-3">{order.table_number}</td>
                  <td className="border p-3 text-left">
                    {order.items.map(item => (
                      <div key={item.order_item_id}>
                         {item.quantity} x {item.menu_name} - ₹{item.price}
                      </div>
                    ))}
                  </td>
                  <td className="border p-3 font-semibold">₹{order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)}</td>
                  <td className={`border p-3 font-semibold ${order.status === "Completed" ? "text-green-600" : order.status === "In Progress" ? "text-blue-600" : "text-yellow-600"}`}>
                    {order.status}
                  </td>
                  <td className="border p-3">
                    {order.status !== "In Progress" && (
                      <button onClick={() => updateStatus(order.order_id, "In Progress")}
                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2 hover:bg-blue-700 transition">
                         <FaSpinner/>  In Progress
                      </button>
                    )}
                    {order.status !== "Completed" && (
                      <button onClick={() => updateStatus(order.order_id, "Completed")}
                        className="bg-green-500 text-white px-4 py-1 rounded mr-2 hover:bg-green-700 transition">
                        <FaCheck/>  Complete
                      </button>
                    )}
                    <button onClick={() => deleteOrder(order.order_id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition">
                      <FaTrash/>  Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-5 text-gray-600">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;
