import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
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
        fetchStaff();
        fetchRestaurants();
    }, []);
        
    // Fetch staff members

    const fetchStaff = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/staff");
            setStaff(response.data);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };
    // Fetch restaurant details
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/restaurant");
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };
    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // Handle form submission (Add / Update Staff)
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
            fetchStaff();
            setFormData({ restaurant_id: "", name: "", role: "Waiter", email: "" });
            setEditingStaff(null);
        } catch (err) {
            setError("Error saving staff: " + err.message);
        }
    };
    //  Delete staff member
    const handleDelete = async (staff_id) => {
      if (!window.confirm("Are you sure you want to delete this staff member?")) return;

      try {
          await axios.delete(`http://localhost:5000/api/staff/${staff_id}`);
          setMessage("Staff deleted successfully!");
          fetchStaff(); // Refresh list after deletion
      } catch (error) {
          setError("Error deleting staff: " + error.message);
          console.error("Error deleting staff:", error);
      }
  };


    return (
        <div className=" mx-auto mt-20 bg-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Management</h2>

            {/* Display Messages */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

            {/* Add/Update Staff Form */}
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

            {/* Staff List */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Staff List</h3>
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
                        {staff.map((staffMember) => (
                            <tr key={staffMember.staff_id} className="border">
                                <td className="border p-2">{staffMember.name}</td>
                                <td className="border p-2">{staffMember.role}</td>
                                <td className="border p-2">{staffMember.restaurant_name}</td>
                                <td className="border p-2">
                                    <button onClick={() => setEditingStaff(staffMember)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(staffMember.staff_id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
