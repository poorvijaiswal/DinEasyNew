import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    customer_name: "",
    order_id: "",  // This will be set automatically from location.state
    rating: "",
    comments: ""
  });

  // Fetch order_id from state passed via navigate (from Order component)
  useEffect(() => {
    if (location.state?.order_id) {
      setForm(prev => ({ ...prev, order_id: location.state.order_id }));
    }
  }, [location.state]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/feedback", form);
      if (response.status === 201) {
        navigate("/thankyou");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Leave Feedback</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customer_name"
          placeholder="Your Name"
          value={form.customer_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="order_id"
          placeholder="Order ID"
          value={form.order_id}
          readOnly // Prevent users from changing it manually
          required
        />
        <select name="rating" value={form.rating} onChange={handleChange} required>
          <option value="">Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Okay</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <textarea
          name="comments"
          placeholder="Any comments?"
          value={form.comments}
          onChange={handleChange}
        />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;

