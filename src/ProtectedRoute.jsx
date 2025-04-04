import React from 'react';
import { Navigate } from 'react-router-dom';
import { loginTokenKey } from './Utils/utils';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem(loginTokenKey);
  
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
