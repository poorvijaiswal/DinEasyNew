import React from "react";
import "./ThankYou.css";

const ThankYou = () => {
  return (
    <div className="thankyou-container">
      <img
        className="emoji"
        src="https://images.emojiterra.com/google/android-12l/512px/263a.png"
        alt="Smiling Emoji"
      />
      <h1>Your feedback is recorded successfully!</h1>
      <p>Thank you for visiting our restaurant!</p>
    </div>
  );
};

export default ThankYou;
