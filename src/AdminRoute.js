import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    user = null;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
