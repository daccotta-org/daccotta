import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Search, X } from "lucide-react"
import {
    useSearchMovies,
    useGetRecommendedMovies,
} from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"
import { genreMap } from "@/lib/stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface SearchHistoryItem {
    term: string
    timestamp: string
}

const NONE = "all"

const SearchMovie: React.FC = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
    const [historyOpen, setHistoryOpen] = useState(false)

    const {
        data: movies,
        isLoading,
        error,
    } = useSearchMovies(
        searchTerm,
        selectedYear ? parseInt(selectedYear) : undefined,
        selectedGenre ? parseInt(selectedGenre) : undefined,
        selectedLanguage || undefined
    )

    const {
        data: recommendedMovies,
        isLoading: isLoadingRecommended,
        error: recommendedMoviesError,
    } = useGetRecommendedMovies(
        selectedYear ? parseInt(selectedYear) : undefined,
        selectedGenre ? parseInt(selectedGenre) : undefined
    )

    useEffect(() => {
        const history = sessionStorage.getItem("searchHistory")
        if (history) {
            setSearchHistory(JSON.parse(history))
        }
    }, [])

    useEffect(() => {
        if (error) {
            toast.error("An error occurred while searching for movies.")
        }
    }, [error])

    useEffect(() => {
        if (recommendedMoviesError) {
            toast.error("An error occurred while fetching recommended movies.")
        }
    }, [recommendedMoviesError])

    const persistHistory = (updated: SearchHistoryItem[]) => {
        setSearchHistory(updated)
        sessionStorage.setItem("searchHistory", JSON.stringify(updated))
    }

    const pushHistory = (term: string) => {
        if (!term.trim()) return
        const timestamp = new Date().toLocaleString()
        const updated = [
            { term, timestamp },
            ...searchHistory.filter((item) => item.term !== term),
        ].slice(0, 5)
        persistHistory(updated)
    }

    const handleSearchSubmit = () => {
        pushHistory(searchTerm)
        setHistoryOpen(false)
    }

    const handleClick = (id: string, title: string) => () => {
        pushHistory(title)
        navigate(`/movie/${id}`)
    }

    const handleHistorySelect = (term: string) => {
        setSearchTerm(term)
        setHistoryOpen(false)
        pushHistory(term)
    }

    const handleHistoryDelete = (index: number) => {
        persistHistory(searchHistory.filter((_, i) => i !== index))
    }

    const handleClearHistory = () => {
        setSearchHistory([])
        sessionStorage.removeItem("searchHistory")
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 70 }, (_, i) => currentYear - i)
    const genres = Object.entries(genreMap)
    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "hi", name: "Hindi" },
        { code: "gu", name: "Gujarati" },
        { code: "ta", name: "Tamil" },
    ]

    const hasFilters = Boolean(selectedYear || selectedGenre || selectedLanguage)

    const MovieCard = ({ movie }: { movie: SimpleMovie }) => (
        <button
            type="button"
            className="group w-full text-left transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleClick(movie.id, movie.title ?? "")}
        >
            {movie.poster_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-md border border-border object-cover shadow-sm"
                />
            ) : (
                <div className="relative w-full pb-[150%] rounded-md border border-border bg-muted">
                    <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-sm text-muted-foreground">
                        {movie.title}
                    </span>
                </div>
            )}
            <h3 className="mt-2 truncate text-sm font-medium text-foreground">
                {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground">
                {movie.release_date?.split("-")[0]}
            </p>
        </button>
    )

    return (
        <div className="flex h-full max-h-screen w-full flex-col items-center overflow-auto scrollbar-hide bg-background text-foreground">
            <header className="flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-8">
                {!searchTerm && (
                    <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                        Find Your Favorite Movie Here
                    </h1>
                )}

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                    <Select
                        value={selectedYear || NONE}
                        onValueChange={(value) =>
                            setSelectedYear(value === NONE ? "" : value)
                        }
                    >
                        <SelectTrigger aria-label="Filter by year">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            <SelectItem value={NONE}>Any year</SelectItem>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedGenre || NONE}
                        onValueChange={(value) =>
                            setSelectedGenre(value === NONE ? "" : value)
                        }
                    >
                        <SelectTrigger aria-label="Filter by genre">
                            <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            <SelectItem value={NONE}>Any genre</SelectItem>
                            {genres.map(([id, name]) => (
                                <SelectItem key={id} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedLanguage || NONE}
                        onValueChange={(value) =>
                            setSelectedLanguage(value === NONE ? "" : value)
                        }
                    >
                        <SelectTrigger aria-label="Filter by language">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            <SelectItem value={NONE}>Any language</SelectItem>
                            {languages.map(({ code, name }) => (
                                <SelectItem key={code} value={code}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasFilters && (
                    <div className="flex w-full justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedYear("")
                                setSelectedGenre("")
                                setSelectedLanguage("")
                            }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}

                <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setHistoryOpen(true)}
                        onBlur={() => {
                            // Allow history clicks to register before closing
                            window.setTimeout(() => setHistoryOpen(false), 150)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchSubmit()
                        }}
                        placeholder="Search movies, TV shows, and more"
                        className="h-11 rounded-full border-input bg-card pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
                        aria-label="Search movies"
                    />
                    {searchTerm && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}

                    {historyOpen &&
                        searchHistory.length > 0 &&
                        !searchTerm && (
                            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                    Recent searches
                                </div>
                                <Separator />
                                <ul>
                                    {searchHistory.map((item, index) => (
                                        <li
                                            key={`${item.term}-${item.timestamp}`}
                                            className="flex items-center justify-between gap-2 px-2"
                                        >
                                            <button
                                                type="button"
                                                className="flex-1 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    handleHistorySelect(
                                                        item.term
                                                    )
                                                }
                                            >
                                                {item.term}
                                            </button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    handleHistoryDelete(index)
                                                }
                                                aria-label={`Remove ${item.term} from history`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <Separator />
                                <div className="flex justify-end p-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={handleClearHistory}
                                    >
                                        Clear history
                                    </Button>
                                </div>
                            </div>
                        )}
                </div>
            </header>

            <div className="w-full flex-1 px-4 py-6">
                {isLoading && searchTerm.length > 2 ? (
                    <div className="flex h-64 items-center justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-6xl space-y-10">
                        {movies && movies.length > 0 ? (
                            <section>
                                <h2 className="mb-4 text-2xl font-semibold">
                                    Search Results
                                </h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {movies.map((movie: SimpleMovie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                        />
                                    ))}
                                </div>
                            </section>
                        ) : (
                            searchTerm.length > 2 && (
                                <p className="mt-12 text-center text-muted-foreground">
                                    No movies found.
                                </p>
                            )
                        )}

                        {(selectedYear || selectedGenre) && (
                            <section>
                                {isLoadingRecommended ? (
                                    <div className="flex justify-center py-12">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    recommendedMovies &&
                                    recommendedMovies.length > 0 && (
                                        <>
                                            <h2 className="mb-4 text-2xl font-semibold">
                                                Recommended Movies
                                            </h2>
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                                {recommendedMovies.map(
                                                    (movie: SimpleMovie) => (
                                                        <MovieCard
                                                            key={movie.id}
                                                            movie={movie}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchMovie
