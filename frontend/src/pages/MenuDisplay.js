import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "./MenuDisplay.css"; // Import CSS file for styling

const MenuDisplay = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]); //  Cart state
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({}); // Track quantity for each item
  const navigate = useNavigate(); //  Use navigate for redirection

  useEffect(() => {
    fetchMenu();

    //  Load cart from localStorage (if exists)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const fetchMenu = async () => {
    try {
      const restaurantId = 1; // Change to dynamic if needed
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenu(response.data);
      
      // Initialize quantities for each item
      const initialQuantities = response.data.reduce((acc, item) => {
        acc[item.id] = 1; // Default quantity = 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      setError("Error fetching menu data.");
      console.error("Error fetching menu:", error);
    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  // Decrease quantity (Minimum 1)
  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  //  Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      //  If item already exists, update quantity
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      //  Otherwise, add new item
      updatedCart = [...cart, item];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); //  Save cart in localStorage

    alert(`${item.name} added to cart!`);
  };

  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">Our Menu</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="menu-list">
          {menu.length > 0 ? (
            menu.map((item) => (
              <div key={item.id} className="menu-item">
                
                {/* Left Side - Image */}
                <img src={`http://localhost:5000/uploads/${item.image_url}`} 
                    alt={item.name} 
                    className="menu-image" />

                {/* Right Side - Details */}
                <div className="menu-content">
                  <h2 className="menu-title">{item.name}</h2>
                  <p className="menu-category">{item.category}</p>
                  <p className="menu-description">{item.description}</p>

                  {/* Price + Quantity Selector + Add to Cart */}
                  <div className="menu-footer">
                    <p className="menu-price">{"\u20B9"}{item.price}</p>

                    {/* Quantity Selector */}
                    <div className="quantity-selector">
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{quantities[item.id]}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => addToCart({ ...item, quantity: quantities[item.id] })}
                      className="add-to-cart">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 w-full">No menu items found.</p>
          )}
        </div>

        {/*  View Cart Button */}
        <button onClick={() => navigate("/cart")} className="view-cart">
          View Cart 
        </button>

      </div>
    </DashboardLayout>
  );
};

export default MenuDisplay;
