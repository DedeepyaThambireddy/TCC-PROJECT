// src/pages/DashboardRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Send users to their main page
  if (user?.role === 'user') {
    return <Navigate to="/my-consignments" replace />;
  }

  // If an admin tries to log in here, kick them back to login
  if (user?.role === 'admin') {
     return <Navigate to="/login" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;