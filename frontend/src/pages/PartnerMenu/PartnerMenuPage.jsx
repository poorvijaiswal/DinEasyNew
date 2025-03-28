import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PartnerMenuPage.module.css";
import '../CartPage.css'
const PartnerMenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Fetch menu on component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
        setMenu(response.data);

        // Initialize quantities for each menu item
        const initialQuantities = response.data.reduce((acc, item) => {
          acc[item.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (err) {
        setError("Error fetching menu.");
        console.error("Error fetching menu:", err);
      }
    };

    fetchMenu();
  }, [restaurantId]);

    // Fetch queue length and estimated wait time
    useEffect(() => {
      const fetchQueueData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/preorder/queue/${restaurantId}`);
          setQueueLength(response.data.queueLength);
          setEstimatedWaitTime(response.data.estimatedWaitTime);
        } catch (err) {
          console.error("Error fetching queue data:", err);
        }
      };
  
      fetchQueueData();
    }, [restaurantId]);

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantities[item.id] }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: quantities[item.id] }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartMessage(`${item.name} added to cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  // Update quantity in cart
  const updateQuantity = (id, change) => {
    // Update the quantities state
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(1, (prevQuantities[id] || 1) + change),
    }));
  
    // Update the cart state
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
  
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove an item from the cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle preorder
  const handlePreorder = async () => {
    try {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart before placing a preorder.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/preorder", {
        restaurant_id: restaurantId,
        customer_id: 1, // Replace with actual customer ID
        items: cart,
      });

      setEstimatedWaitTime(response.data.estimated_wait_time);
      alert(`Preorder placed successfully! Estimated wait time: ${response.data.estimated_wait_time} minutes.`);
      navigate("/checkout", {
        state: {
          cart,
          totalPrice,
          restaurantId,
        },
      });
    } catch (err) {
      console.error("Error placing preorder:", err);
      alert("Error placing preorder.");
    }
  };

  return (
    <div className={styles.container}><br/><br/>
      <p className="text-gray-700 mt-4 font-bold text-red-700">Queue Length: {queueLength} orders</p>
      <p className="text-gray-700 mt-4 font-bold text-red-700">Estimated Wait Time: {estimatedWaitTime} minutes</p>
      <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {cartMessage && <p className="text-green-500 text-center">{cartMessage}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 side">
        {menu.map((item) => (
          <div key={item.id} className={`${styles["menu-item"]} p-6 bg-white shadow-lg rounded-lg`}>
            <img
              src={`http://localhost:5000/uploads/${item.image_url}`}
              alt={item.name}
              className={`${styles["menu-image"]} mb-4`}
            />
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-lg font-bold mb-4">₹{item.price}</p>

            <div className={`${styles["quantity-selector"]} mb-4`}>
              <button onClick={() => updateQuantity(item.id, -1)} className={styles["quantity-button"]}>
                -
              </button>
              <span className={styles["quantity-value"]}>{quantities[item.id]}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className={styles["quantity-button"]}>
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(item)}
              className={`${styles["add-to-cart"]} bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="text-center mt-6">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name} - ₹{item.price} x {item.quantity}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
            </div>
          ))}
          <h3 className="text-lg font-bold mt-4">Total: ₹{totalPrice.toFixed(2)}</h3>
          
          <button
            onClick={handlePreorder}
            className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Place Preorder
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnerMenuPage;