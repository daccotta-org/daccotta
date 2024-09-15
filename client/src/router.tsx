import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom"
import React from "react"
import { AuthProvider } from "./context/AuthContext"
import RootLayout from "./layouts/root-layout"
import AuthenticatedLayout from "./layouts/authenticated-layout"
import HomePage from "./pages/Home/HomePage"
import ProfilePage from "./pages/Profile/ProfilePage"
import FriendSearch from "./pages/Friends/Friends"
import SignInPage from "./pages/auth/SignInPage"
import SignUpPage from "./pages/auth/SignUpPage"
import OnboardingForm from "./pages/Onboard/Onboard"
import SearchMovie from "./pages/SearchMovie/SearchMovie"
import FriendsPage from "./pages/Friends/FriendsPage"
import FriendsSearch from "./pages/Friends/Friends"
import CreateList from "./pages/CreateList/CreateList"
import MovieDetailPage from "./pages/MoviePage/MovieDetailPage"

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    return <AuthProvider navigate={navigate}>{children}</AuthProvider>
}

export const router = createBrowserRouter([
    {
        element: (
            <AuthWrapper>
                <RootLayout />
            </AuthWrapper>
        ),
        children: [
            {
                path: "/onboard",
                element: <OnboardingForm />,
            },
            {
                path: "/signin",
                element: <SignInPage />,
            },
            {
                path: "/signup",
                element: <SignUpPage />,
            },
            {
                element: <AuthenticatedLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/friends", element: <FriendsSearch /> },
                    { path: "/search-movie", element: <SearchMovie /> },
                    // {path:"create-list",element:<CreateList/>},
                    {path:"/movie/:id", element:<MovieDetailPage />}
                ],
            },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
])
