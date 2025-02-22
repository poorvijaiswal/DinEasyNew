import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MembershipSelection() {
  const [duration, setDuration] = useState(3);
  const [membershipId, setMembershipId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve membership_id from local storage or session storage
    const storedMembershipId = localStorage.getItem('membership_id');
    if (storedMembershipId) {
      setMembershipId(storedMembershipId);
      console.log('Membership ID:', storedMembershipId);
    } else {
      // Redirect to login if membership_id is not found
      navigate('/login');
    }
  }, [navigate]);

  const handleSelectMembership = async () => {
    try {
      let membershipType;
      let price;
      switch (duration) {
        case 3:
          membershipType = 'Basic';
          price = 10; // Example price in INR
          break;
        case 6:
          membershipType = 'Standard';
          price = 20; // Example price in INR
          break;
        case 12:
          membershipType = 'Premium';
          price = 30; // Example price in INR
          break;
        default:
          membershipType = 'Unknown';
          price = 0;
      }

      const response = await axios.post("http://localhost:5000/api/membership/select-membership", {
        membership_id: membershipId,
        duration,
        membershipType,
        price
      });

      if (response.status === 200) {
        navigate('/payment', { state: { membershipId, duration, membershipType, price } });
      }
    } catch (error) {
      console.error("Error selecting membership:", error.response?.data || error.message);
    }
  };

  return (
    <div className="pt-16 max-h-screen flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center">Select Membership Plan</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className={`card ${duration === 3 ? 'selected' : ''}`} onClick={() => setDuration(3)}>
            <h3 className="text-xl font-bold">Basic</h3>
            <p className="text-gray-600">3 Months</p>
            <p className="text-gray-600">Price: ₹10</p>
          </div>
          <div className={`card ${duration === 6 ? 'selected' : ''}`} onClick={() => setDuration(6)}>
            <h3 className="text-xl font-bold">Standard</h3>
            <p className="text-gray-600">6 Months</p>
            <p className="text-gray-600">Price: ₹20</p>
          </div>
          <div className={`card ${duration === 12 ? 'selected' : ''}`} onClick={() => setDuration(12)}>
            <h3 className="text-xl font-bold">Premium</h3>
            <p className="text-gray-600">12 Months</p>
            <p className="text-gray-600">Price: ₹30</p>
          </div>
        </div>
        <button
          onClick={handleSelectMembership}
          className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition mt-6"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}