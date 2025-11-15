// src/pages/DashboardRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role === 'user') {
    return <Navigate to="/my-consignments" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;