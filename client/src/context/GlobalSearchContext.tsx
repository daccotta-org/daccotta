import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export type SearchEntity = "movies" | "friends"
export type FriendScope = "all" | "friends"

export interface GlobalSearchFilters {
    year: string
    genre: string
    language: string
    friendScope: FriendScope
}

interface GlobalSearchContextType {
    isOpen: boolean
    query: string
    type: SearchEntity
    filters: GlobalSearchFilters
    openSearch: (opts?: { type?: SearchEntity; query?: string }) => void
    closeSearch: () => void
    toggleSearch: () => void
    setQuery: (query: string) => void
    setType: (type: SearchEntity) => void
    setFilters: (patch: Partial<GlobalSearchFilters>) => void
    clearMovieFilters: () => void
}

const defaultFilters: GlobalSearchFilters = {
    year: "",
    genre: "",
    language: "",
    friendScope: "all",
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(
    undefined
)

function buildSearchPath(
    type: SearchEntity,
    query: string,
    filters: GlobalSearchFilters
) {
    const params = new URLSearchParams()
    params.set("type", type)
    if (query) params.set("q", query)
    if (type === "movies") {
        if (filters.year) params.set("year", filters.year)
        if (filters.genre) params.set("genre", filters.genre)
        if (filters.language) params.set("language", filters.language)
    } else if (filters.friendScope !== "all") {
        params.set("scope", filters.friendScope)
    }
    const qs = params.toString()
    return qs ? `/search?${qs}` : "/search"
}

function parseEntity(value: string | null): SearchEntity {
    return value === "friends" ? "friends" : "movies"
}

function parseFriendScope(value: string | null): FriendScope {
    return value === "friends" ? "friends" : "all"
}

export function GlobalSearchProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const previousPathRef = useRef<string | null>(null)

    const isOpen = location.pathname === "/search"

    const [query, setQueryState] = useState(() =>
        isOpen ? (searchParams.get("q") ?? "") : ""
    )
    const [type, setTypeState] = useState<SearchEntity>(() =>
        isOpen ? parseEntity(searchParams.get("type")) : "movies"
    )
    const [filters, setFiltersState] = useState<GlobalSearchFilters>(() =>
        isOpen
            ? {
                  year: searchParams.get("year") ?? "",
                  genre: searchParams.get("genre") ?? "",
                  language: searchParams.get("language") ?? "",
                  friendScope: parseFriendScope(searchParams.get("scope")),
              }
            : { ...defaultFilters }
    )

    // Hydrate from URL whenever we are on /search
    useEffect(() => {
        if (!isOpen) return
        setQueryState(searchParams.get("q") ?? "")
        setTypeState(parseEntity(searchParams.get("type")))
        setFiltersState({
            year: searchParams.get("year") ?? "",
            genre: searchParams.get("genre") ?? "",
            language: searchParams.get("language") ?? "",
            friendScope: parseFriendScope(searchParams.get("scope")),
        })
    }, [isOpen, searchParams])

    const syncUrl = useCallback(
        (
            nextType: SearchEntity,
            nextQuery: string,
            nextFilters: GlobalSearchFilters,
            replace = true
        ) => {
            navigate(buildSearchPath(nextType, nextQuery, nextFilters), {
                replace,
            })
        },
        [navigate]
    )

    const openSearch = useCallback(
        (opts?: { type?: SearchEntity; query?: string }) => {
            if (!isOpen) {
                previousPathRef.current =
                    location.pathname + location.search + location.hash
            }

            const nextType = opts?.type ?? type
            const nextQuery = opts?.query ?? query
            const nextFilters = filters

            if (opts?.type) setTypeState(opts.type)
            if (opts?.query !== undefined) setQueryState(opts.query)

            syncUrl(nextType, nextQuery, nextFilters, isOpen)
        },
        [filters, isOpen, location.hash, location.pathname, location.search, query, syncUrl, type]
    )

    const closeSearch = useCallback(() => {
        const fallback = previousPathRef.current || "/"
        previousPathRef.current = null
        if (isOpen) {
            navigate(fallback, { replace: true })
        }
    }, [isOpen, navigate])

    const toggleSearch = useCallback(() => {
        if (isOpen) closeSearch()
        else openSearch()
    }, [closeSearch, isOpen, openSearch])

    const setQuery = useCallback(
        (next: string) => {
            setQueryState(next)
            if (isOpen) syncUrl(type, next, filters)
        },
        [filters, isOpen, syncUrl, type]
    )

    const setType = useCallback(
        (next: SearchEntity) => {
            setTypeState(next)
            if (isOpen) syncUrl(next, query, filters)
        },
        [filters, isOpen, query, syncUrl]
    )

    const setFilters = useCallback(
        (patch: Partial<GlobalSearchFilters>) => {
            setFiltersState((prev) => {
                const next = { ...prev, ...patch }
                if (isOpen) syncUrl(type, query, next)
                return next
            })
        },
        [isOpen, query, syncUrl, type]
    )

    const clearMovieFilters = useCallback(() => {
        setFiltersState((prev) => {
            const next = { ...prev, year: "", genre: "", language: "" }
            if (isOpen) syncUrl(type, query, next)
            return next
        })
    }, [isOpen, query, syncUrl, type])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                toggleSearch()
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [toggleSearch])

    const value: GlobalSearchContextType = {
        isOpen,
        query,
        type,
        filters,
        openSearch,
        closeSearch,
        toggleSearch,
        setQuery,
        setType,
        setFilters,
        clearMovieFilters,
    }

    return (
        <GlobalSearchContext.Provider value={value}>
            {children}
        </GlobalSearchContext.Provider>
    )
}

export function useGlobalSearch() {
    const context = useContext(GlobalSearchContext)
    if (!context) {
        throw new Error(
            "useGlobalSearch must be used within a GlobalSearchProvider"
        )
    }
    return context
}
