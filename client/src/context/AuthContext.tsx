import React, { createContext, useEffect, useState, useCallback } from "react"
import axios from "axios"
import { NavigateFunction } from "react-router-dom"
import { config } from "@/lib/config"
import {
    authClient,
    authHeaders,
    getBearerToken,
    setBearerToken,
} from "@/lib/auth-client"

export interface AuthUser {
    uid: string
    email: string | null
    id: string
    getIdToken: () => Promise<string | null>
}

interface AuthState {
    user: AuthUser | null
    isLoaded: boolean
    sessionId: string | null
    idToken: string | null
    isOnboarded: boolean | undefined
}

interface AuthContextType extends AuthState {
    routerPush: (to: string) => void
    routerReplace: (to: string) => void
    signOut: () => Promise<void>
    updateOnboardingStatus: (status: boolean) => void
    checkOnboardingStatus: () => Promise<void>
}

const initialAuthState: AuthState = {
    user: null,
    isLoaded: false,
    sessionId: null,
    idToken: null,
    isOnboarded: undefined,
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
    navigate: NavigateFunction
}

function toAuthUser(sessionUser: {
    id: string
    email: string
}): AuthUser {
    return {
        uid: sessionUser.id,
        id: sessionUser.id,
        email: sessionUser.email,
        getIdToken: async () => getBearerToken(),
    }
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState)
    const { data: session, isPending } = authClient.useSession()

    const checkOnboardingStatus = useCallback(async () => {
        const uid = session?.user?.id
        if (!uid) return

        try {
            const response = await axios.get(
                `${config.api.baseUrl}/api/user/${uid}/onboarded`,
                {
                    headers: {
                        ...authHeaders(),
                    },
                }
            )
            setAuthState((prevState) => ({
                ...prevState,
                isOnboarded: response.data.onboarded,
            }))
        } catch (error) {
            console.error("Error fetching onboarding status:", error)
            setAuthState((prevState) => ({
                ...prevState,
                isOnboarded: false,
            }))
        }
    }, [session?.user?.id])

    useEffect(() => {
        if (isPending) return

        if (session?.user) {
            const user = toAuthUser(session.user)
            setAuthState({
                user,
                isLoaded: true,
                sessionId: session.session.id,
                idToken: getBearerToken(),
                isOnboarded: undefined,
            })
            checkOnboardingStatus()
        } else {
            setAuthState({
                user: null,
                isLoaded: true,
                sessionId: null,
                idToken: null,
                isOnboarded: undefined,
            })
        }
    }, [session, isPending, checkOnboardingStatus])

    const updateOnboardingStatus = (status: boolean) => {
        setAuthState((prevState) => ({ ...prevState, isOnboarded: status }))
    }

    const routerPush = (to: string) => navigate(to)
    const routerReplace = (to: string) => navigate(to, { replace: true })

    const handleSignOut = async () => {
        await authClient.signOut()
        setBearerToken(null)
        setAuthState({
            user: null,
            isLoaded: true,
            sessionId: null,
            idToken: null,
            isOnboarded: undefined,
        })
    }

    const value = {
        ...authState,
        routerPush,
        routerReplace,
        signOut: handleSignOut,
        updateOnboardingStatus,
        checkOnboardingStatus,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
