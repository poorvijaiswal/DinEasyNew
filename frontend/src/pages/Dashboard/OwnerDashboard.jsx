import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axios from "axios";

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    activeOrders: 0,
    pendingDeliveries: 0,
  });
  const [restaurantId, setRestaurantId] = useState(null);
  const [error, setError] = useState("");

  // Fetch restaurant_id for the logged-in user
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
        console.error("Error fetching restaurant ID:", err);
        setError("Failed to fetch restaurant ID.");
      }
    };

    fetchRestaurantId();
  }, []);

  // Fetch dashboard data for the specific restaurant
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!restaurantId) return;
  
      try {
        const response = await axios.get(
          `http://localhost:5000/api/dashboard/overview?restaurant_id=${restaurantId}`
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data.');
      }
    };
  
    fetchDashboardData();
  }, [restaurantId]);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome to the Dashboard
      </h2>
      <p className="mt-2 text-gray-600">
        Manage your restaurant operations here. Track orders, manage staff, and analyze sales.
      </p>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Total Sales</h3>
          <p className="text-2xl font-semibold">₹{dashboardData.totalSales.toLocaleString()}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Active Orders</h3>
          <p className="text-2xl font-semibold">{dashboardData.activeOrders}</p>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Pending Deliveries</h3>
          <p className="text-2xl font-semibold">{dashboardData.pendingDeliveries}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}