// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { RouterProvider } from 'react-router-dom';
// import './index.css';
// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import AuthenticatedLayout from './layouts/authenticated-layout';
// import UnauthenticatedLayout from './layouts/unauth-layout';
// import HomePage from './pages/Home/HomePage';
// import ProfilePage from './pages/Profile/ProfilePage';
// import FriendSearch from './pages/Friends/Friends';
// import SignInPage from './pages/auth/SignInPage';
// import SignUpPage from './pages/auth/SignUpPage';
// import OnboardingForm from './pages/Onboard/Onboard';
// import RootLayout from './layouts/root-layout';
// const queryClient = new QueryClient();
// export const router = createBrowserRouter([
//   {
//     element: <RootLayout />,
//     children: [
//       {
//         element: <AuthenticatedLayout />,
      
//         children: [
//           { path: '/', element: <HomePage /> },
//           { path: '/profile', element: <ProfilePage /> },
//           { path: '/friends', element: <FriendSearch /> },
          
//         ],
//       },
//       {
//         path: '/onboard',
//         element: <OnboardingForm />,
//       },
//       {
//         element: <UnauthenticatedLayout />,
//         children: [
//           { path: '/signin', element: <SignInPage /> },
//           { path: '/signup', element: <SignUpPage /> },
//         ],
//       },
//       { path: '*', element: <Navigate to="/" replace /> },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router'; // We'll update this file

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);