import axios from 'axios';

// Base URL for the backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend runs on another port or domain
});

// Example: Register function for a restaurant owner
export const registerOwner = (ownerData) => {
  // console.log('ownerData:', ownerData); // Log ownerData to the console
  return API.post('/auth/register', ownerData);
};

// Verify Email function
export const verifyEmail = (data) => {
  return API.post('/auth/verify', data);
};

// Restaurant Registration
export const registerRestaurant = (data) => API.post('/restaurant/register', data);

// Login for Owner
export const loginOwner = (data) => API.post('/auth/login', data);

// Login for Staff
export const loginStaff = (data) => API.post('/auth/staff-login', data);
// Add more functions for other endpoints as needed


// Create Razorpay Order
// export const createRazorpayOrder = (amount) => API.post('/membership/create-razorpay-order', { amount });

export const createRazorpayOrder = async (price, membershipId) => {
  const response = await axios.post("http://localhost:5000/api/payment/create-razorpay-order", {
    price,
    membershipId
  });
  return response.data;
};
export default API;

