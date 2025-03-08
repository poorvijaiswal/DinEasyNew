import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
const MenuList = () => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
        const restaurantId = 1; // Replace with dynamic restaurant ID
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Menu List</h2>

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
                  <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="w-20 h-20 rounded-lg" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-3 text-gray-600">
                No menu items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
};

export default MenuList;