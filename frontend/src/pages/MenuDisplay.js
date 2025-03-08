import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const MenuDisplay = ({ addToCart }) => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const restaurantId = 1; // Change to dynamic if needed
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenu(response.data);
    } catch (error) {
      setError("Error fetching menu data.");
      console.error("Error fetching menu:", error);
    }
  };

  return (
    <DashboardLayout>
    <div className="container mx-auto p-6 mt-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Menu</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menu.length > 0 ? (
          menu.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition">
              <img src={`http://localhost:5000/uploads/${item.image_url}`} 
                   alt={item.name} 
                   className="w-full h-52 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <p className="text-lg font-bold text-green-600">{"\u20B9"}{item.price}</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition">
                   Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-4">No menu items found.</p>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default MenuDisplay;
