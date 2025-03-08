import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation
import DashboardLayout from "../components/DashboardLayout";

const StaffListPage= () => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff");
      setStaff(response.data);
    } catch (error) {
      setError("Error fetching staff data.");
      console.error("Error fetching staff:", error);
    }
  };

  const handleDelete = async (staff_id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/staff/${staff_id}`);
      fetchStaff(); // Refresh list after deletion
    } catch (error) {
      setError("Error deleting staff: " + error.message);
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <DashboardLayout>
    <div className="max-w-4xl mx-auto mt-8 bg-slate-100 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff List</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="text-right mb-4">
        <Link to="/manage-staff" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Manage Staff
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Restaurant</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((staffMember) => (
              <tr key={staffMember.staff_id} className="border">
                <td className="border p-2">{staffMember.name}</td>
                <td className="border p-2">{staffMember.role}</td>
                <td className="border p-2">{staffMember.restaurant_name}</td>
                <td className="border p-2">
                  <Link to={`/manage-staff?edit=${staffMember.staff_id}`} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(staffMember.staff_id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-3 text-gray-600">
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
};

export default StaffListPage;
