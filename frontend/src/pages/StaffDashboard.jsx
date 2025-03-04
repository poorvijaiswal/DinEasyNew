import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchOrders = () => {
    axios.get("http://localhost:5000/orders").then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
    socket.on("orderUpdate", fetchOrders);
    return () => socket.off("orderUpdate");
  }, []);

  // Update order status
  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/orders/${id}`, { status })
      .then(fetchOrders);
  };

  // Delete order
  const deleteOrder = (id) => {
    axios.delete(`http://localhost:5000/orders/${id}`)
      .then(fetchOrders);
  };

  return (
    <div className="container mx-auto mt-20 bg-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h1 className="text-2xl font-bold">Staff Order Dashboard</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Table No</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.order_id} className="border">
                <td className="border p-2">{order.order_id}</td>
                <td className="border p-2">{order.table_id}</td>
                <td className="border p-2">
                  {order.items.map(item => (
                    <div key={item.order_item_id}>
                      Menu #{item.menu_id} - {item.quantity} pcs (${item.price})
                    </div>
                  ))}
                </td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {order.status !== "Completed" && (
                    <button onClick={() => updateStatus(order.order_id, "Completed")}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                      Complete Order
                    </button>
                  )}
                  <button onClick={() => deleteOrder(order.order_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center p-4">No orders found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDashboard;
