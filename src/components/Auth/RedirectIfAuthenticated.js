// redirectIfAuthenticated - student b 
// If the user is already logged in, don't let them route to login / register pages 
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './authService.js';

const RedirectIfAuthenticated = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectIfAuthenticated;
