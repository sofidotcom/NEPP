import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('userId'); // Replace with your authentication logic

  // If authenticated, render the child routes
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;