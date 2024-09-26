import React, { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
const RootLayout: React.FC = () => {
    const { user, isOnboarded, isLoaded, checkOnboardingStatus } = useAuth()
    const location = useLocation()

    useEffect(() => {
        if (user && isOnboarded === undefined) {
            checkOnboardingStatus()
        }
    }, [user, isOnboarded, checkOnboardingStatus])

    if (!isLoaded) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
        )
    }

    // Paths that don't require authentication
    const publicPaths = ["/signin", "/signup"]

    if (!user) {
        // If the user is on a public path, render it
        if (publicPaths.includes(location.pathname)) {
            return <Outlet />
        }
        // Otherwise, redirect to signup
        return <Navigate to="/signup" replace />
    }

    // If onboarding status is still undefined, show loading
    if (isOnboarded === undefined) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        )
    }

    if (!isOnboarded) {
        if (location.pathname === "/onboard") {
            return <Outlet />
        }
        return <Navigate to="/onboard" replace />
    }

    // User is authenticated and onboarded
    if (
        publicPaths.includes(location.pathname) ||
        location.pathname === "/onboard"
    ) {
        // Redirect to home if trying to access signin/signup/onboard while authenticated and onboarded
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default RootLayout
