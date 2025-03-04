import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuList = () => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      setMenu(response.data);
    } catch (error) {
      setError("Error fetching menu data.");
      console.error("Error fetching menu:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      fetchMenu(); // Refresh menu list
    } catch (error) {
      setError("Error deleting menu item: " + error.message);
      console.error("Error deleting menu item:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 bg-white shadow-lg rounded-2xl p-8 w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Menu List</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.length > 0 ? (
            menu.map((item) => (
              <tr key={item.id} className="border">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.category}</td>
                <td className="border p-2">${item.price}</td>
                <td className="border p-2">
                  <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="w-16 h-16 rounded-lg" />
                </td>
                <td className="border p-2">
                  <Link to={`/menu?edit=${item.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
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
  );
};

export default MenuList;
