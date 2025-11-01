import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService.js';

/**
 * ProtectedRoute
 * - renders children when user is authenticated
 * - else redirects to /login and preserves the attempted location in state
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (isAuthenticated()) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
