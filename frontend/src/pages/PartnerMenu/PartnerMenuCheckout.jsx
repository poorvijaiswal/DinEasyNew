import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, restaurantId } = location.state || { cart: [], totalPrice: 0, restaurantId: null };
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);

const handlePayment = async () => {
    try {
      setIsLoading(true);
  
      // Step 1: Create Razorpay order
      const orderResponse = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: totalPrice,
      });
  
      const { orderId, amount } = orderResponse.data;
  
      // Step 2: Open Razorpay payment modal
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "DinEasy",
        description: "Preorder Payment",
        order_id: orderId,
        handler: async (response) => {
          // Step 3: Verify payment and create preorder
          const verifyResponse = await axios.post("http://localhost:5000/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            restaurant_id: restaurantId,
            customer_id: 1,
            items: cart,
            amount: totalPrice,
          });
          
          const { preorderId } = verifyResponse.data;

          // Step 4: Fetch QR Code
          const qrResponse = await axios.get(`http://localhost:5000/api/payment/generate-qrcode/${preorderId}`);
          setQrCode(qrResponse.data.qrCode);

          alert("Payment successful! Preorder created.");
          navigate(`/bill/${preorderId}`);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

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

      <h2 className="checkout-total">Total: {"\u20B9"}{totalPrice.toFixed(2)}</h2>

      <button className="confirm-order" onClick={handlePayment} disabled={!restaurantId}>
        Proceed to pay
      </button>

      <button className="back-to-cart" onClick={() => navigate(`/menu/${restaurantId}`)}>
        Back to Cart
      </button>
    </div>
  );
};

export default CheckoutPage;

