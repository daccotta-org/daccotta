import { createAuthClient } from "better-auth/react"
import { config } from "@/lib/config"

const BEARER_TOKEN_KEY = "bearer_token"

export function getBearerToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(BEARER_TOKEN_KEY)
}

export function setBearerToken(token: string | null) {
    if (typeof window === "undefined") return
    if (token) {
        localStorage.setItem(BEARER_TOKEN_KEY, token)
    } else {
        localStorage.removeItem(BEARER_TOKEN_KEY)
    }
}

export function authHeaders(): { Authorization?: string } {
    const token = getBearerToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authClient = createAuthClient({
    baseURL: config.api.baseUrl,
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => getBearerToken() || "",
        },
        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token")
            if (authToken) {
                setBearerToken(authToken)
            }
        },
    },
})
