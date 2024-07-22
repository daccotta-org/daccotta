import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RootLayout from './layouts/root-layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/HomePage.tsx'
import ProfilePage from './pages/Profile/ProfilePage.tsx'


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage /> ,
        
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />   
  </React.StrictMode>,
)
