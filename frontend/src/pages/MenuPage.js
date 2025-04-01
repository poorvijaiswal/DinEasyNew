import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const MenuPage = () => {
  const [restaurantId, setRestaurantId] = useState(null);  // Store fetched restaurant ID
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    restaurant_id: "",
    category: "Starters",
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurantId();  // First, fetch restaurant ID
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();  // Fetch menu items only after restaurantId is available
    }
  }, [restaurantId]);

  // Fetch Restaurant ID
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
      setRestaurantId(response.data.restaurant_id);
      setFormData((prev) => ({ ...prev, restaurant_id: response.data.restaurant_id })); // Set default restaurant ID in form
    } catch (error) {
      console.error("Error fetching restaurant ID:", error);
      setError("Error fetching restaurant ID");
    }
  };

  // Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError("Error fetching menu items.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.restaurant_id || !formData.category || !formData.name || !formData.price) {
      setError("All fields are required.");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Menu item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/menu", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Menu item added successfully!");
      }
      setFormData({ restaurant_id: restaurantId, category: "Starters", name: "", description: "", price: "", image: null });
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      setError("Error saving menu item: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      restaurant_id: item.restaurant_id,
      category: item.category,
      name: item.name,
      description: item.description,
      price: item.price,
      image: null, // Image will not be pre-filled
    });
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      setMessage("Menu item deleted successfully!");
      fetchMenuItems();
    } catch (error) {
      setError("Error deleting menu item: " + error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Restaurant Menu</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded-lg">
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Dish Name</label>
            <input type="text" name="name" placeholder="Enter dish name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea name="description" placeholder="Enter description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded-lg"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Price</label>
            <input type="number" name="price" placeholder="Enter price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Upload Image</label>
            <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded-lg" required={!editingItem} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {editingItem ? "Update Menu Item" : "Add Menu Item"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/menu-list" className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
            View Menu List
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Menu Items</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{"\u20B9"}{item.price}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
