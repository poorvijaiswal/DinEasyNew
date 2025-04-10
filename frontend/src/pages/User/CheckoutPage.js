
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart: initialCart, totalPrice: initialTotalPrice } = location.state || { cart: [], totalPrice: 0 };

  const [cart, setCart] = useState(initialCart);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
  const [restaurantId, setRestaurantId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Extract Table Number from URL or LocalStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let tableNum = queryParams.get("table") || localStorage.getItem("table_number");

    if (tableNum) {
      setTableNumber(tableNum);
      localStorage.setItem("table_number", tableNum); // Store for persistence
    } else {
      setErrorMessage("Table number not found! Please rescan the QR code.");
    }
  }, [location.search]);

  // Fetch restaurant_id dynamically from backend
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("No token found! Please login.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/getRestaurantId", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurantId(response.data.restaurant_id);
      } catch (error) {
        console.error("Error fetching restaurant ID:", error);
        setErrorMessage("Failed to fetch restaurant ID. Try again later.");
      }
    };

    fetchRestaurantId();
  }, [navigate]);

  // Load Cart from LocalStorage if Empty
  useEffect(() => {
    if (cart.length === 0) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }

    if (!totalPrice) {
      const calculatedTotal = (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(calculatedTotal);
    }
  }, [cart, totalPrice]);

  // Confirm Order and Proceed to Payment
  const handleConfirmOrder = async () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Cart is empty! Please add items before checkout.");
      return;
    }
    if (!restaurantId) {
      alert("Restaurant ID not available. Please try again.");
      return;
    }
    if (!tableNumber) {
      alert("Table number not found! Please rescan the QR code.");
      return;
    }
  
    try {
      // Create the order
      const orderResponse = await axios.post("http://localhost:5000/api/order", {
        items: cart,
        table_number: tableNumber,
        restaurant_id: restaurantId,
      });
  
      if (orderResponse.status === 201) {
        const { order_id } = orderResponse.data;
  
        console.log("Order created successfully with ID:", order_id);
  
        // Proceed to payment using Razorpay
        const paymentResponse = await axios.post("http://localhost:5000/api/payment/create", {
          order_id,
          amount: totalPrice,
          payment_method: "UPI",
        });
  
        const paymentId = paymentResponse.data.payment_id;
  
        const options = {
          
          key: "rzp_test_aR6MrtfKJOXT9l", // Replace with your Razorpay key ID
          amount: totalPrice * 100, // Amount in paise
          currency: "INR",
          name: "DinEasy",
          description: "Order Payment",
          handler: async () => {
            console.log("Sending update-status request with data:", {
              payment_id: paymentId,
              status: "Paid",
              order_id,
            });
            await axios.put("http://localhost:5000/api/payment/update-status", {
              payment_id: paymentId,
              status: "Paid",
              order_id,
              items: cart, // Include cart items
              table_number: tableNumber, // Include table number
              restaurant_id: restaurantId, // Include restaurant ID    
            });
            localStorage.removeItem("cart");
            alert("Payment successful! Redirecting to order status...");
            navigate(`/order-status`, { state: { order_id } }); // Redirect to order status page
          },
          prefill: {
            name: "Your Name",
            email: "your-email@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Failed to create order: " + orderResponse.data.message);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Table Number: {tableNumber || "Not Found"}</h2>

      <div className="cart-summary">
        {cart.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="checkout-image" />
            <div>
              <h2>{item.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {"\u20B9"}{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="checkout-total">Total: {"\u20B9"}{(totalPrice || 0).toFixed(2)}</h2>

      <button className="confirm-order" onClick={handleConfirmOrder} disabled={!restaurantId}>
        Confirm Order
      </button>

      <button className="back-to-cart" onClick={() => navigate("/cart")}>
        Back to Cart
      </button>
    </div>
  );
};

export default CheckoutPage;