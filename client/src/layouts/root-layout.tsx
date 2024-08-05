// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import AuthenticatedLayout from './authenticated-layout';

// const RootLayout: React.FC = () => {
//   const { user, isOnboarded, isLoaded } = useAuth();
//   const location = useLocation();

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   // Paths that don't require authentication
//   const publicPaths = ['/signin', '/signup'];

//   if (!user) {
//     // If the user is on a public path, render it
//     if (publicPaths.includes(location.pathname)) {
//       return <Outlet />;
//     }
//     // Otherwise, redirect to signup
//     return <Navigate to="/signup" replace />;
//   }

//   if (!isOnboarded) {
//     console.log("onboarding ji",isOnboarded);
    
//     if (location.pathname === '/onboard') {
//       return <Outlet />;
//     }
//     return <Navigate to="/onboard" replace />;
//   }

//   // User is authenticated and onboarded
//   if (publicPaths.includes(location.pathname)) {
//     // Redirect to home if trying to access signin/signup while authenticated
//     return <Navigate to="/" replace />;
//   }

//   return <AuthenticatedLayout />;
// };

// export default RootLayout;
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthenticatedLayout from './authenticated-layout';

const RootLayout: React.FC = () => {
  const { user, isOnboarded, isLoaded, checkOnboardingStatus } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && isOnboarded === undefined) {
      checkOnboardingStatus();
    }
  }, [user, isOnboarded, checkOnboardingStatus]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Paths that don't require authentication
  const publicPaths = ['/signin', '/signup'];

  if (!user) {
    // If the user is on a public path, render it
    if (publicPaths.includes(location.pathname)) {
      return <Outlet />;
    }
    // Otherwise, redirect to signup
    return <Navigate to="/signup" replace />;
  }

  // If onboarding status is still undefined, show loading
  if (isOnboarded === undefined) {
    return <div>Checking onboarding status...</div>;
  }

  if (!isOnboarded) {
    if (location.pathname === '/onboard') {
      return <Outlet />;
    }
    return <Navigate to="/onboard" replace />;
  }

  // User is authenticated and onboarded
  if (publicPaths.includes(location.pathname) || location.pathname === '/onboard') {
    // Redirect to home if trying to access signin/signup/onboard while authenticated and onboarded
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RootLayout;