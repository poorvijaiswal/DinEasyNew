import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";


const MenuDisplay = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]); // Cart state
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const [cartMessage, setCartMessage] = useState(""); // Message state
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();

    // Load cart from localStorage (if exists)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const fetchMenu = async () => {
    try {
      const restaurantId = 3; // Change to dynamic if needed
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenu(response.data);
      
      const initialQuantities = response.data.reduce((acc, item) => {
        acc[item.id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      setError("Error fetching menu data.");
      console.error("Error fetching menu:", error);
    }
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      updatedCart = [...cart, item];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    //  Display "Added to Cart" message (for 2 seconds)
    setCartMessage(`${item.name} added to cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">Our Menu</h1>

        {error && <p className="error-message">{error}</p>}

        {/*  Display "Added to Cart" Message */}
        {cartMessage && <p className="cart-message">{cartMessage}</p>}

        <div className="menu-list">
          {menu.length > 0 ? (
            menu.map((item) => (
              <div key={item.id} className="menu-item">
                <img src={`http://localhost:5000/uploads/${item.image_url}`} 
                     alt={item.name} 
                     className="menu-image" />

                <div className="menu-content">
                  <h2 className="menu-title">{item.name}</h2>
                  <p className="menu-category">{item.category}</p>
                  <p className="menu-description">{item.description}</p>

                  <div className="menu-footer">
                    <p className="menu-price">{"\u20B9"}{item.price}</p>

                    <div className="quantity-selector">
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{quantities[item.id]}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>

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

        <button onClick={() => navigate("/cart")} className="view-cart">
          View Cart 
        </button>
      </div>
    </DashboardLayout>
  );
};

export default MenuDisplay;
