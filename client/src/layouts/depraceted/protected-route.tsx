import React, { ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from "../assets/logo_light.png"

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, user, isOnboarded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-[100vh] justify-center items-center">
        <img className="opacity-80" src={logo} alt="Loading" width="100px" />
      </div>
    );
  }

  if (user && !isOnboarded && window.location.pathname !== '/onboard') {
    return <Navigate to="/onboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
