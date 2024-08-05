import React from 'react'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import './index.css'
import RootLayout from './layouts/root-layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/HomePage.tsx'
import ProfilePage from './pages/Profile/ProfilePage.tsx'
import SignInPage from './pages/auth/SignInPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import FriendSearch from './pages/Friends/Friends.tsx'
import OnboardingForm from './pages/Onboard/Onboard.tsx'


const queryClient = new QueryClient()

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
        
      },
      {
        path:"/signin",
        //element: <SignInPage />
        element: <SignInPage/>
      },
      {
        path:"/signup",
        //element: <SignUpPage />
        element: <SignUpPage />
      },

      
      {
        path:"/onboard",
        element:<OnboardingForm/>
      },
      {
        path:"/friends",
        element: <FriendSearch />
      }
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>      
        <RouterProvider router={router} />   
      </QueryClientProvider>
  </React.StrictMode>,
)
