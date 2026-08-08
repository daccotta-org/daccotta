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
} as const

const requiredEnvVars = ["VITE_API_BASE_URL", "VITE_ACCESS_KEY"]

export const validateConfig = () => {
    const missing = requiredEnvVars.filter(
        (varName) => !import.meta.env[varName]
    )

    if (missing.length > 0) {
        console.warn("Missing environment variables:", missing)
    }
}

if (import.meta.env.DEV) {
    validateConfig()
}
