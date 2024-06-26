import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ProfileLayout } from './layouts/profile-layout.tsx'
import RootLayout from './layouts/root-layout.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './pages/auth/SignInPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import HomePage from './pages/Home/HomePage.tsx'
import ProfilePage from './pages/Profile/ProfilePage.tsx'


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: < HomePage/> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <ProfileLayout />,
        path: "Profile",
        children: [
          { path: "/Profile/*", element: <ProfilePage /> },
        
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />   
  </React.StrictMode>,
)
