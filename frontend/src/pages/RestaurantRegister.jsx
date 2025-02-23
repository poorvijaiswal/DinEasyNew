import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantRegister() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState(null);


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

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/restaurant/register', {
        membership_id: membershipId, // Replace with actual membership_id from logged-in user
        name,
        address
      });
      if (response.status === 201) {
        setMessage('Restaurant registered successfully');
        navigate('/dashboard/owner'); // Navigate to dashboard after successful registration
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center">Register Your Restaurant</h2>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}