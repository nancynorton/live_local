
//ProtectedRoute
//renders children when user is authenticated
// else redirects to /login and preserves the attempted location in state

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './Auth/authService.js';


const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (isAuthenticated()) {
    return children;
  }
// protected routes redirect to /login component
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
