import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customer/order/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching your orders.");
      console.error("Error fetching user orders:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-16 bg-white shadow-lg rounded-xl p-8 w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Orders</h1>
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
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id} className="border text-center">
                  <td className="border p-3">{order.order_id}</td>
                  <td className="border p-3">{order.table_number}</td>
                  <td className="border p-3 text-left">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.quantity} x {item.menu_name} - ₹{item.price}
                      </div>
                    ))}
                  </td>
                  <td className="border p-3 font-semibold">
                    ₹{order.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                  </td>
                  <td
                    className={`border p-3 font-semibold ${
                      order.status === "Completed"
                        ? "text-green-600"
                        : order.status === "In Progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-5 text-gray-600">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;