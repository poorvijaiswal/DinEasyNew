import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  // Function to confirm order
  const handleConfirmOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          totalPrice,
          table_number: 1, // Replace this with dynamic table_id from table_qr
          restaurant_id: 1, // Replace with actual restaurant_id
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart"); // Clear cart after order
        navigate("/dashboard/staff");
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

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

      { /*Total Amount*/ }
      <h2 className="checkout-total">Total: {"\u20B9"}{totalPrice.toFixed(2)}</h2>

      { /*Confirm Order Button */}
      <button className="confirm-order" onClick={handleConfirmOrder}>
        Confirm Order
      </button>

      { /*Back to Cart Button */}
      <button className="back-to-cart" onClick={() => navigate("/cart")}>
        Back to Cart
      </button>
    </div>
  );
};

export default CheckoutPage;
