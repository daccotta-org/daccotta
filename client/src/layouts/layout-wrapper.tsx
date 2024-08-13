// LayoutWrapper.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LayoutWrapper: React.FC = () => {
  const { isLoaded, user, isOnboarded } = useAuth();
  

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-[100vh] justify-center items-center">
        <img className="opacity-80" src="/logo.png" alt="Loading" width="100px" />
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
