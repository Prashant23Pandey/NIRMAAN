import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'worker' | 'homeowner' | 'contractor' | 'SUPER_ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { role } = useApp();
  const location = useLocation();

  const token = localStorage.getItem('nirmaan_auth_token');
  const userJson = localStorage.getItem('nirmaan_user');
  const user = userJson ? (() => {
    try { return JSON.parse(userJson); } catch { return null; }
  })() : null;

  // If no active session / unauthenticated guest, redirect immediately to login
  const isAuthenticated = Boolean(token || user || (role && role !== 'guest'));

  if (!isAuthenticated || role === 'guest') {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Strict Role isolation redirect if accessing a mismatched shell
  if (allowedRole && role !== allowedRole) {
    if (role === 'worker') return <Navigate to="/worker/mason" replace />;
    if (role === 'homeowner') return <Navigate to="/homeowner/home" replace />;
    if (role === 'contractor') return <Navigate to="/contractor/dashboard" replace />;
    if (role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
