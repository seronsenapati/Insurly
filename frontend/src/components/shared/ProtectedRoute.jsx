import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const ProtectedRoute = ({ allowedRoles = ['worker', 'admin'] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on requested route
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect admin trying to access worker page, or worker trying to access admin page
    const targetRoute = user.role === 'admin' ? '/admin/dashboard' : '/worker/dashboard';
    return <Navigate to={targetRoute} replace />;
  }

  return <Outlet />;
};
