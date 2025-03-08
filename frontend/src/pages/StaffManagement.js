import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation

const StaffManagement = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [formData, setFormData] = useState({
        restaurant_id: "",
        name: "",
        role: "Waiter",
        email: "",
    });
    const [editingStaff, setEditingStaff] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/restaurant");
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.restaurant_id || !formData.name || !formData.role || !formData.email) {
            setError("All fields are required.");
            return;
        }

        try {
            if (editingStaff) {
                await axios.put(`http://localhost:5000/api/staff/${editingStaff.staff_id}`, formData);
                setMessage("Staff updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/staff", formData);
                setMessage("Staff added successfully!");
            }
            setFormData({ restaurant_id: "", name: "", role: "Waiter", email: "" });
            setEditingStaff(null);
        } catch (err) {
            setError("Error saving staff: " + err.message);
        }
    };

    return (
        <div className="mx-auto mt-20 bg-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Management</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Select Restaurant</label>
                    <select name="restaurant_id" value={formData.restaurant_id} onChange={handleChange} className="w-full border p-2 rounded-lg">
                        <option value="">Choose a Restaurant</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.restaurant_id} value={restaurant.restaurant_id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Staff Name</label>
                    <input type="text" name="name" placeholder="Enter staff name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
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
                    <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/staff-list" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                    View Staff List
                </Link>
            </div>
        </div>
    );
};

export default StaffManagement;
