import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Protected Route component that checks if user is authenticated
 * Redirects to login if not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  // Check if we have a stored token/user data
  const authStatus = checkAuthStatus();
  
  if (!isAuthenticated && !authStatus) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;