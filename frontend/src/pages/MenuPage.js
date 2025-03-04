import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurant_id: "",
    category: "Starters",
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
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
      await axios.post("http://localhost:5000/api/menu", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Menu item added successfully!");
      setFormData({ restaurant_id: "", category: "Starters", name: "", description: "", price: "", image: null });
    } catch (err) {
      setError("Error adding menu item: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-gray-50 rounded-lg shadow-md ">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Restaurant Menu</h2>

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
          <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded-lg" required />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Add Menu Item
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/menu-list" className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
          View Menu List
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
