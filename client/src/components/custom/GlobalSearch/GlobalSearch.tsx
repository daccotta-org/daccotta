import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { Film, Search, UserPlus, Users, X } from "lucide-react"
import {
    useGetRecommendedMovies,
    useSearchMovies,
} from "@/services/movieService"
import { useSearchUsers } from "@/services/userService"
import { useFriends } from "@/services/friendsService"
import { useAuth } from "@/hooks/useAuth"
import { SimpleMovie } from "@/Types/Movie"
import { genreMap } from "@/lib/stats"
import { useGlobalSearch } from "@/context/GlobalSearchContext"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { cn } from "@/lib/utils"

const NONE = "all"

interface SearchHistoryItem {
    term: string
    timestamp: string
}

interface SearchUser {
    _id?: string
    uid?: string
    userName: string
    profile_image?: string
}

function GlobalSearch() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const {
        isOpen,
        query,
        type,
        filters,
        closeSearch,
        setQuery,
        setType,
        setFilters,
        clearMovieFilters,
    } = useGlobalSearch()

    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
    const [historyOpen, setHistoryOpen] = useState(false)
    const [friendRequestStatus, setFriendRequestStatus] = useState<{
        [key: string]: { loading: boolean; sent: boolean }
    }>({})

    const {
        data: movies,
        isLoading: isLoadingMovies,
        error: moviesError,
    } = useSearchMovies(
        type === "movies" ? query : "",
        filters.year ? parseInt(filters.year) : undefined,
        filters.genre ? parseInt(filters.genre) : undefined,
        filters.language || undefined
    )

    const {
        data: recommendedMovies,
        isLoading: isLoadingRecommended,
        error: recommendedError,
    } = useGetRecommendedMovies(
        type === "movies" && filters.year
            ? parseInt(filters.year)
            : undefined,
        type === "movies" && filters.genre
            ? parseInt(filters.genre)
            : undefined
    )

    const { useGetFriends, useSendFriendRequest } = useFriends()
    const { data: friendsData } = useGetFriends({ page: 1, limit: 100 })
    const sendFriendRequestMutation = useSendFriendRequest()
    const friendList: string[] = friendsData?.friends ?? []

    const {
        data: searchUsers,
        isLoading: isLoadingUsers,
        error: usersError,
    } = useSearchUsers(
        type === "friends" && filters.friendScope === "all" ? query : "",
        user?.uid
    )

    const filteredFriends = useMemo(() => {
        if (type !== "friends" || filters.friendScope !== "friends") return []
        const q = query.trim().toLowerCase()
        if (q.length < 3) return []
        return friendList.filter((name) => name.toLowerCase().includes(q))
    }, [friendList, filters.friendScope, query, type])

    useEffect(() => {
        const history = sessionStorage.getItem("searchHistory")
        if (history) setSearchHistory(JSON.parse(history))
    }, [])

    useEffect(() => {
        if (moviesError) {
            toast.error("An error occurred while searching for movies.")
        }
    }, [moviesError])

    useEffect(() => {
        if (recommendedError) {
            toast.error("An error occurred while fetching recommended movies.")
        }
    }, [recommendedError])

    useEffect(() => {
        if (usersError) {
            toast.error("An error occurred while searching for users.")
        }
    }, [usersError])

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

    const handleClose = (open: boolean) => {
        if (!open) closeSearch()
    }

    const goToMovie = (id: string, title: string) => {
        pushHistory(title)
        navigate(`/movie/${id}`)
    }

    const goToUser = (userName: string) => {
        navigate(`/user/${userName}`)
    }

    const handleSendRequest = async (friendUserName: string) => {
        if (friendRequestStatus[friendUserName]?.sent) return
        setFriendRequestStatus((prev) => ({
            ...prev,
            [friendUserName]: { loading: true, sent: false },
        }))
        try {
            await sendFriendRequestMutation.mutateAsync(friendUserName)
            setFriendRequestStatus((prev) => ({
                ...prev,
                [friendUserName]: { loading: false, sent: true },
            }))
            toast.success(`Friend request sent to ${friendUserName}`)
        } catch (error) {
            setFriendRequestStatus((prev) => ({
                ...prev,
                [friendUserName]: { loading: false, sent: false },
            }))
            const message =
                error instanceof AxiosError
                    ? error.response?.data?.message ||
                      "Failed to send friend request"
                    : "Failed to send friend request"
            toast.error(message)
        }
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

    const hasMovieFilters = Boolean(
        filters.year || filters.genre || filters.language
    )
    const showMovieResults = type === "movies" && query.length > 2
    const showFriendResults = type === "friends" && query.length > 2

    const isFriend = (userName: string) =>
        friendList.some((f) => f.toLowerCase() === userName.toLowerCase())

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                hideClose
                className="flex max-h-[85vh] w-full max-w-3xl flex-col gap-0 overflow-hidden border-border bg-card p-0 sm:rounded-[4px]"
                aria-describedby={undefined}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Global search</DialogTitle>
                    <DialogDescription>
                        Search movies and friends
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 border-b border-border p-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setHistoryOpen(true)}
                            onBlur={() => {
                                window.setTimeout(() => setHistoryOpen(false), 150)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && query.trim()) {
                                    pushHistory(query)
                                    setHistoryOpen(false)
                                }
                            }}
                            placeholder={
                                type === "movies"
                                    ? "Search movies..."
                                    : "Search friends..."
                            }
                            className="h-11 border-input bg-transparent pl-10 pr-16 text-foreground placeholder:text-muted-foreground focus-visible:ring-electric"
                            aria-label="Global search"
                        />
                        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                            {query ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setQuery("")}
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            ) : (
                                <kbd className="hidden rounded-[4px] border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
                                    ⌘K
                                </kbd>
                            )}
                        </div>

                        {historyOpen &&
                            type === "movies" &&
                            searchHistory.length > 0 &&
                            !query && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[4px] border border-border bg-popover text-popover-foreground shadow-md">
                                    <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                                                    className="flex-1 rounded-[4px] px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    onClick={() => {
                                                        setQuery(item.term)
                                                        pushHistory(item.term)
                                                        setHistoryOpen(false)
                                                    }}
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
                                                        persistHistory(
                                                            searchHistory.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            )
                                                        )
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
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() => {
                                                setSearchHistory([])
                                                sessionStorage.removeItem(
                                                    "searchHistory"
                                                )
                                            }}
                                        >
                                            Clear history
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </div>

                    <Tabs
                        value={type}
                        onValueChange={(v) =>
                            setType(v as "movies" | "friends")
                        }
                    >
                        <TabsList>
                            <TabsTrigger value="movies" className="gap-1.5">
                                <Film className="h-3.5 w-3.5" />
                                Movies
                            </TabsTrigger>
                            <TabsTrigger value="friends" className="gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                Friends
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {type === "movies" ? (
                        <div className="space-y-2">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <Select
                                    value={filters.year || NONE}
                                    onValueChange={(value) =>
                                        setFilters({
                                            year: value === NONE ? "" : value,
                                        })
                                    }
                                >
                                    <SelectTrigger aria-label="Filter by year">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        <SelectItem value={NONE}>
                                            Any year
                                        </SelectItem>
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.genre || NONE}
                                    onValueChange={(value) =>
                                        setFilters({
                                            genre: value === NONE ? "" : value,
                                        })
                                    }
                                >
                                    <SelectTrigger aria-label="Filter by genre">
                                        <SelectValue placeholder="Genre" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        <SelectItem value={NONE}>
                                            Any genre
                                        </SelectItem>
                                        {genres.map(([id, name]) => (
                                            <SelectItem key={id} value={id}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.language || NONE}
                                    onValueChange={(value) =>
                                        setFilters({
                                            language:
                                                value === NONE ? "" : value,
                                        })
                                    }
                                >
                                    <SelectTrigger aria-label="Filter by language">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        <SelectItem value={NONE}>
                                            Any language
                                        </SelectItem>
                                        {languages.map(({ code, name }) => (
                                            <SelectItem
                                                key={code}
                                                value={code}
                                            >
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {hasMovieFilters && (
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearMovieFilters}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    filters.friendScope === "all"
                                        ? "default"
                                        : "outline"
                                }
                                className={cn(
                                    filters.friendScope === "all" &&
                                        "bg-primary"
                                )}
                                onClick={() =>
                                    setFilters({ friendScope: "all" })
                                }
                            >
                                All users
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    filters.friendScope === "friends"
                                        ? "default"
                                        : "outline"
                                }
                                className={cn(
                                    filters.friendScope === "friends" &&
                                        "bg-primary"
                                )}
                                onClick={() =>
                                    setFilters({ friendScope: "friends" })
                                }
                            >
                                My friends
                            </Button>
                        </div>
                    )}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {type === "movies" && (
                        <>
                            {isLoadingMovies && showMovieResults ? (
                                <div className="flex h-48 items-center justify-center">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {movies && movies.length > 0 ? (
                                        <section>
                                            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Search results
                                            </h3>
                                            <ul className="space-y-1">
                                                {movies.map(
                                                    (movie: SimpleMovie) => (
                                                        <MovieResultRow
                                                            key={movie.id}
                                                            movie={movie}
                                                            onSelect={goToMovie}
                                                        />
                                                    )
                                                )}
                                            </ul>
                                        </section>
                                    ) : (
                                        showMovieResults && (
                                            <p className="py-8 text-center text-sm text-muted-foreground">
                                                No movies found.
                                            </p>
                                        )
                                    )}

                                    {(filters.year || filters.genre) && (
                                        <section>
                                            {isLoadingRecommended ? (
                                                <div className="flex justify-center py-8">
                                                    <LoadingSpinner />
                                                </div>
                                            ) : (
                                                recommendedMovies &&
                                                recommendedMovies.length >
                                                    0 && (
                                                    <>
                                                        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                            Recommended
                                                        </h3>
                                                        <ul className="space-y-1">
                                                            {recommendedMovies.map(
                                                                (
                                                                    movie: SimpleMovie
                                                                ) => (
                                                                    <MovieResultRow
                                                                        key={
                                                                            movie.id
                                                                        }
                                                                        movie={
                                                                            movie
                                                                        }
                                                                        onSelect={
                                                                            goToMovie
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </ul>
                                                    </>
                                                )
                                            )}
                                        </section>
                                    )}

                                    {!showMovieResults &&
                                        !filters.year &&
                                        !filters.genre && (
                                            <p className="py-8 text-center text-sm text-muted-foreground">
                                                Type at least 3 characters to
                                                search movies.
                                            </p>
                                        )}
                                </div>
                            )}
                        </>
                    )}

                    {type === "friends" && (
                        <>
                            {!showFriendResults ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    Type at least 3 characters to search{" "}
                                    {filters.friendScope === "friends"
                                        ? "your friends"
                                        : "users"}
                                    .
                                </p>
                            ) : filters.friendScope === "friends" ? (
                                filteredFriends.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No friends match your search.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {filteredFriends.map((name) => (
                                            <FriendResultRow
                                                key={name}
                                                userName={name}
                                                onSelect={goToUser}
                                            />
                                        ))}
                                    </ul>
                                )
                            ) : isLoadingUsers ? (
                                <div className="flex h-48 items-center justify-center">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : !searchUsers || searchUsers.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No users found.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {(searchUsers as SearchUser[]).map((u) => {
                                        const alreadyFriend = isFriend(
                                            u.userName
                                        )
                                        const status =
                                            friendRequestStatus[u.userName]
                                        return (
                                            <FriendResultRow
                                                key={
                                                    u._id ||
                                                    u.uid ||
                                                    u.userName
                                                }
                                                userName={u.userName}
                                                onSelect={goToUser}
                                                action={
                                                    alreadyFriend ? (
                                                        <span className="text-xs text-muted-foreground">
                                                            Friend
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            disabled={
                                                                status?.loading ||
                                                                status?.sent
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleSendRequest(
                                                                    u.userName
                                                                )
                                                            }}
                                                        >
                                                            <UserPlus className="mr-1 h-3.5 w-3.5" />
                                                            {status?.loading
                                                                ? "Sending..."
                                                                : status?.sent
                                                                  ? "Sent"
                                                                  : "Add"}
                                                        </Button>
                                                    )
                                                }
                                            />
                                        )
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function MovieResultRow({
    movie,
    onSelect,
}: {
    movie: SimpleMovie
    onSelect: (id: string, title: string) => void
}) {
    return (
        <li>
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[4px] border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-surface"
                onClick={() => onSelect(movie.id, movie.title ?? "")}
            >
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt=""
                        className="h-14 w-10 shrink-0 rounded-[4px] border border-border object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-[4px] border border-border bg-muted text-[10px] text-muted-foreground">
                        N/A
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-sm font-semibold text-foreground">
                        {movie.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {movie.release_date?.split("-")[0] || "—"}
                    </p>
                </div>
            </button>
        </li>
    )
}

function FriendResultRow({
    userName,
    onSelect,
    action,
}: {
    userName: string
    onSelect: (userName: string) => void
    action?: React.ReactNode
}) {
    return (
        <li className="flex items-center justify-between gap-3 rounded-[4px] border border-border px-3 py-2.5">
            <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => onSelect(userName)}
            >
                <Avatar className="h-9 w-9 rounded-[4px]">
                    <AvatarImage
                        src={`/api/avatar/${userName}`}
                        alt={userName}
                        className="rounded-[4px]"
                    />
                    <AvatarFallback className="rounded-[4px] text-xs">
                        {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="truncate font-heading text-sm font-semibold">
                    {userName}
                </span>
            </button>
            {action}
        </li>
    )
}

export default GlobalSearch
