import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";
const StaffManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingStaff = location.state?.staff || null;

  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurant_id: "",
    name: "",
    role: "Waiter",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurantId();
    if (editingStaff) {
      setFormData(editingStaff);
    }
  }, [editingStaff]);

  const fetchRestaurantId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in local storage");
      }
      const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.restaurant_id) {
        throw new Error("Restaurant ID not found");
      }
      setFormData((prev) => ({ ...prev, restaurant_id: response.data.restaurant_id })); // Set default restaurant ID in form
    } catch (error) {
      console.error("Error fetching restaurant ID:", error);
      setError("Error fetching restaurant ID");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    if (!formData.restaurant_id || !formData.name || !formData.role || !formData.email) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
      };
  
      if (editingStaff) {
        await axios.put(
          `http://localhost:5000/api/staff/${editingStaff.staff_id}`,
          formData,
          config // Pass headers
        );
        setMessage("Staff updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/staff", formData, config);
        setMessage("Staff added successfully!");
      }
  
      navigate("/staff-list");
    } catch (err) {
      console.error("Error:", err);
      setError("Error saving staff: " + (err.response?.data?.message || err.message));
    }
  };
  

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {editingStaff ? "Update Staff" : "Add Staff"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Staff Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded-lg">
              <option value="Manager">Manager</option>
              <option value="Chef">Chef</option>
              <option value="Waiter">Waiter</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {editingStaff ? "Update Staff" : "Add Staff"}
          </button>
          <div className="mt-6 text-center">
                <Link to="/staff-list" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                    View Staff List
                </Link>
            </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default StaffManagement;