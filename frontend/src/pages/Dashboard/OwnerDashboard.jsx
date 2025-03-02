import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function OwnerDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to the Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Manage your restaurant operations here. Track orders, manage staff, and analyze sales.
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Total Sales</h3>
          <p className="text-2xl font-semibold">₹1,25,000</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Active Orders</h3>
          <p className="text-2xl font-semibold">42</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold">Pending Deliveries</h3>
          <p className="text-2xl font-semibold">7</p>
        </div>
      </div>
    </DashboardLayout>
  );
}