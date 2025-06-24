import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = ({ allowedRoles }) => {
//   const token = localStorage.getItem("token");

//   // Decode the token to extract the user's role
//   const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;

//   // Check if the user is authenticated and has the required role
//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (!allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page if the role doesn't match
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;