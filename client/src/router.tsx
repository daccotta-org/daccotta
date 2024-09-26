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
import MovieList from "./pages/List/MovieList"
import Profile from "./pages/Profile/Profile"
import UserLists from "./pages/List/UserList"
import JournalPage from "./pages/Journal/JournalPage"
import StatsPage2 from "./pages/Stats/StatsPage2"
import UserDescriptivePage from "./pages/UserDescriptive/UserDescriptive"
import StatsPageFriends from "./pages/Stats/statsPageFriend"

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
