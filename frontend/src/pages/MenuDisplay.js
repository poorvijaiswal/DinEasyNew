import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "./MenuDisplay.css";

const MenuDisplay = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [restaurantId, setRestaurantId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cartMessage, setCartMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); // ✅ Store categories
  const [selectedCategory, setSelectedCategory] = useState("All"); // ✅ Default category
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // ✅ Toggle category dropdown
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantId();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const fetchRestaurantId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in local storage");
      }

      const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedRestaurantId = response.data.restaurant_id;
      setRestaurantId(fetchedRestaurantId);
      fetchMenu(fetchedRestaurantId);
    } catch (error) {
      console.error("Error fetching restaurant ID:", error);
      setError("Error fetching restaurant ID.");
    }
  };

  const fetchMenu = async (id) => {
    try {
      if (!id) return;

      const response = await axios.get(`http://localhost:5000/api/menu/${id}`);
      setMenu(response.data);
      setFilteredMenu(response.data);

      // ✅ Extract Unique Categories
      const uniqueCategories = ["All", ...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);

      const initialQuantities = response.data.reduce((acc, item) => {
        acc[item.id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError("Error fetching menu data.");
    }
  };

  // ✅ Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterMenu(selectedCategory, value);
  };

  // ✅ Filter Menu Based on Category & Search
  const filterMenu = (category, term) => {
    let filtered = menu;

    if (category !== "All") {
      filtered = menu.filter(item => item.category === category);
    }

    if (term) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(term));
    }

    setFilteredMenu(filtered);
  };

  // ✅ Handle Category Selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    filterMenu(category, searchTerm);
  };

  const increaseQuantity = (id) => setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decreaseQuantity = (id) => setQuantities(prev => ({ ...prev, [id]: prev[id] > 1 ? prev[id] - 1 : 1 }));

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantities[item.id] } : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: quantities[item.id] }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`${item.name} added to cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">Our Menu</h1>

        {error && <p className="error-message">{error}</p>}

        {/* ✅ Search Bar & Category Filter */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />

          <div className="menu-container">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/restaurant-menu-5-628087.png"
              alt="Menu"
              className="menu-icon"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            />
            {/* ✅ Category Dropdown */}
            {showCategoryDropdown && (
              <ul className="category-dropdown">
                {categories.map((category, index) => (
                  <li key={index} onClick={() => handleCategorySelect(category)}>
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {cartMessage && <p className="cart-message">{cartMessage}</p>}

        {/* ✅ Menu List */}
        <div className="menu-list">
          {filteredMenu.length > 0 ? (
            filteredMenu.map(item => (
              <div key={item.id} className="menu-item">
                <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="menu-image" />

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

                    <button onClick={() => addToCart(item)} className="add-to-cart">
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
