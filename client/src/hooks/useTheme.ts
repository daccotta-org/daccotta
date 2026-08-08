import { useState, useEffect, useCallback } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark"
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.removeAttribute("data-theme")
}

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next)
    }, [])

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
    }, [])

    return { theme, setTheme, toggleTheme }
}
