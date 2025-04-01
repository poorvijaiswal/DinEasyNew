import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";

const MenuList = () => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurantId();
  }, []);

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
      fetchMenu(response.data.restaurant_id); // Directly fetch menu
    } catch (error) {
      console.error("Error fetching restaurant ID:", error);
      setError("Error fetching restaurant ID");
    }
  };

  const fetchMenu = async (restaurantId) => {
    try {
      if (!restaurantId) return;
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenu(response.data);
    } catch (error) {
      setError("Error fetching menu data.");
      console.error("Error fetching menu:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-8 bg-white shadow-lg rounded-2xl p-6 w-full">
        <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Menu List</h2>
       
       <Link to="/menu" className="bg-green-600 mb-3 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
         Edit Menu
       </Link>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {menu.length > 0 ? (
              menu.map((item) => (
                <tr key={item.id} className="border">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-l font-bold text-green-600">{"\u20B9"}{item.price}</td>
                  <td className="border p-2 w-50">
                    <img 
                      src={item.image_url ? `http://localhost:5000/uploads/${item.image_url}` : "https://via.placeholder.com/100"} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-lg"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-600">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default MenuList;
