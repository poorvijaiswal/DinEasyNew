import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import DashboardLayout from "../components/DashboardLayout";
import "./CartPage.css"; 

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  //  Load cart items from localStorage when component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [] ;
    setCart(storedCart);
  }, []);

  //  Update quantity in cart
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  //  Remove an item from the cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  //  Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Go back to the menu and add some items!</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="cart-image" />

                <div className="cart-details">
                  <h2 className="cart-title">{item.name}</h2>
                  <p className="cart-price">{"\u20B9"}{item.price} x {item.quantity}</p>

                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>

                  {/* Remove Item Button */}
                  <button className="remove-item" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total Price & Checkout Button */}
            <div className="cart-total">
              <h2>Total: {"\u20B9"}{totalPrice.toFixed(2)}</h2>

              {/*  Navigate to Checkout Page with Cart Data */}
              <button 
                className="checkout-button"
                onClick={() => navigate("/checkout", { state: { cart, totalPrice } })}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/*  Back to Menu Button */}
        <button onClick={() => navigate("/menu-Display")} className="back-to-menu">
          Back to Menu
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CartPage;
