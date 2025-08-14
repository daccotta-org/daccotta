// Environment variables configuration
export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    },
    tmdb: {
        apiKey: import.meta.env.VITE_ACCESS_KEY,
        baseUrl: "https://api.themoviedb.org/3",
        imageBaseUrl: "https://image.tmdb.org/t/p",
    },
    firebase: {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
    },
} as const

// Validate required environment variables
const requiredEnvVars = [
    "VITE_API_BASE_URL",
    "VITE_ACCESS_KEY",
    "VITE_API_KEY",
    "VITE_AUTH_DOMAIN",
    "VITE_PROJECT_ID",
    "VITE_STORAGE_BUCKET",
    "VITE_MESSAGING_SENDER_ID",
    "VITE_APP_ID",
]

export const validateConfig = () => {
    const missing = requiredEnvVars.filter(
        (varName) => !import.meta.env[varName]
    )

    if (missing.length > 0) {
        console.warn("Missing environment variables:", missing)
    }
}

// Call validation in development
if (import.meta.env.DEV) {
    validateConfig()
}
