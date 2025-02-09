import axios from 'axios';

// Base URL for the backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend runs on another port or domain
});

// Example: Register function for a restaurant owner
export const registerOwner = (ownerData) => API.post('/auth/register', ownerData);

// Example: Login function for a restaurant owner
export const loginOwner = (credentials) => API.post('/auth/login', credentials);

// Add more functions for other endpoints as needed

export default API;
