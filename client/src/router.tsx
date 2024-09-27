import React from "react"
import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import AuthenticatedLayout from "./layouts/authenticated-layout"
import RootLayout from "./layouts/root-layout"
import SignInPage from "./pages/auth/SignInPage"
import SignUpPage from "./pages/auth/SignUpPage"
import FriendsSearch from "./pages/Friends/Friends"
import HomePage from "./pages/Home/HomePage"
import JournalPage from "./pages/Journal/JournalPage"
import MovieList from "./pages/List/MovieList"
import UserLists from "./pages/List/UserList"
import MovieDetailPage from "./pages/MoviePage/MovieDetailPage"
import OnboardingForm from "./pages/Onboard/Onboard"
import Profile from "./pages/Profile/Profile"
import SearchMovie from "./pages/SearchMovie/SearchMovie"
import StatsPage2 from "./pages/Stats/StatsPage2"
import StatsPageFriends from "./pages/Stats/statsPageFriend"
import UserDescriptivePage from "./pages/UserDescriptive/UserDescriptive"

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
                    { path: "/profile", element: <Profile /> },
                    { path: "/friends", element: <FriendsSearch /> },
                    { path: "/search-movie", element: <SearchMovie /> },
                    // {path:"create-list",element:<CreateList/>},
                    { path: "/movie/:id", element: <MovieDetailPage /> },
                    { path: "/lists", element: <UserLists /> },
                    { path: "/list/:listId", element: <MovieList /> },
                    { path: "/journal", element: <JournalPage /> },
                    { path: "/stats", element: <StatsPage2 /> },
                    { path: "/stats/:userName", element: <StatsPageFriends /> },
                    {
                        path: "/user/:userName",
                        element: <UserDescriptivePage />,
                    },
                ],
            },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
])
