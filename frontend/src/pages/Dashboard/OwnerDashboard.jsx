import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axios from "axios";

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    activeOrders: 0,
    pendingDeliveries: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/overview");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome to the Dashboard
      </h2>
      <p className="mt-2 text-gray-600">
        Manage your restaurant operations here. Track orders, manage staff, and analyze sales.
      </p>

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
