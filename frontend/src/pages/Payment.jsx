import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createRazorpayOrder } from "../services/api"; // Import the new API function
import axios from "axios";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { membershipId, duration, membershipType, price } = location.state || {};
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!membershipId || !duration || !price || !membershipType) {
      navigate('/select-membership');
    } else {
      // Create Razorpay Order
      createRazorpayOrder(price, membershipId)
        .then(response => {
          console.log(`Order created with amount: ${response.amount}`);
          setOrderId(response.id);
          setAmount(response.amount);
        })
        .catch(error => {
          console.error("Error creating Razorpay order:", error.response?.data || error.message);
        });
    }
  }, [membershipId, duration, price, navigate, membershipType]);

  const handlePayment = async () => {
    console.log('Order ID before opening Razorpay:', orderId); // Log the orderId before opening Razorpay
    const options = {
      key: "rzp_test_aR6MrtfKJOXT9l", // Replace with your Razorpay key ID
      amount: amount, // Amount in paise
      currency: "INR",
      name: "DinEasy",
      description: "Membership Payment",
      order_id: orderId,
      handler: async (response) => {
        try {
          console.log(`Payment successful with payment_id: ${response.razorpay_payment_id}`);
          // Update membership details in the database
          const result = await axios.post("http://localhost:5000/api/membership/update-membership", {
            membership_id: membershipId,
            duration,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id
          });
          if (result.status === 200) {
            // navigate('/dashboard'); // Redirect to dashboard after successful payment
            navigate('/restaurant-register'); // Redirect to register restaurants after successful payment
          }
        } catch (error) {
          console.error("Error updating membership:", error.response?.data || error.message);
        }
      },
      prefill: {
        name: "Your Name",
        email: "your-email@example.com",
        contact: "9999999999"
      },
      notes: {
        address: "Your Address"
      },
      theme: {
        color: "#3399cc"
      }
    };

    console.log(`Opening Razorpay with options:`, options);
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
  };

  return (
    <div className="max-h-screen flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center">Payment</h2>
        <p className="text-center mb-4">Membership Type: {membershipType}</p>
        <p className="text-center mb-4">Amount to be Paid: ₹{price}</p> {/* Convert back to rupees for display */}
        <button
          onClick={handlePayment}
          className="bg-green-500 text-white py-3 rounded-lg w-full hover:bg-green-600 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}