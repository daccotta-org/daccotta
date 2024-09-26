// LayoutWrapper.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LayoutWrapper: React.FC = () => {
  const { isLoaded, user, isOnboarded } = useAuth();
  

  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user && !isOnboarded) {
    return <Navigate to="/onboard" replace />;
  }

  return <Outlet />;
};

export default LayoutWrapper;
