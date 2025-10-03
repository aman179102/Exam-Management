import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect if the role does not match
    // For example, a student trying to access an admin route
    return <Navigate to={userRole === 'admin' ? '/admin' : '/student'} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
