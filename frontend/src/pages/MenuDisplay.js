import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./MenuDisplay.css";

const MenuDisplay = () => {
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(null);
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [ratings, setRatings] = useState({});
  const [cart, setCart] = useState([]); // State for cart
  const [error, setError] = useState("");
  const [restaurantId, setRestaurantId] = useState(null);
  const [quantities, setQuantities] = useState({}); // State for item quantities
  const [cartMessage, setCartMessage] = useState(""); // State for cart messages
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tableNum = queryParams.get("table");
    if (tableNum) setTableNumber(tableNum);
  }, [location.search]);

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
      fetchRatings(fetchedRestaurantId);
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

  const fetchRatings = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/ratings/${id}`);
      const ratingsData = response.data.reduce((acc, item) => {
        acc[item.menu_id] = item.average_rating;
        return acc;
      }, {});
      setRatings(ratingsData);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError("Error fetching ratings.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterMenu(selectedCategory, value);
  };

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container">
      <h1 className="title">Our Menu</h1>
      {error && <p className="error-message">{error}</p>}

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

      <div className="menu-list">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <div key={item.id} className="menu-item">
              <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="menu-image" />
              <div className="menu-content">
                <h2 className="menu-title">{item.name}</h2>
                <p className="menu-category">{item.category}</p>
                <p className="menu-description">{item.description}</p>
                <div className="menu-rating">{renderStars(Math.round(ratings[item.id] || 0))}</div>
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
      <button onClick={() => navigate(`/cart?table=${tableNumber}`)} className="view-cart">
        View Cart
      </button>
    </div>
  );
};

export default MenuDisplay;