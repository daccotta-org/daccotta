import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleMovie } from "@/Types/Movie"
import {
    getListById,
    addMovieToList,
    removeMovieFromList,
} from "@/services/userService"
import { fetchMoviesByIds } from "@/services/movieService"
import { useAuth } from "@/hooks/useAuth"
import MovieSearch from "./MovieSearch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import MovieCard from "@/components/custom/MovieCard/MovieCard"
import FullPageLoader from "@/components/ui/FullPageLoader"

export interface List {
    list_id: string
    name: string
    movies: SimpleMovie[]
}

async function hydrateMovies(raw: SimpleMovie[]): Promise<SimpleMovie[]> {
    if (!raw?.length) return []

    const hasDetails = raw.every((m) => m.title && m.poster_path)
    if (hasDetails) {
        return raw.map((m) => ({
            ...m,
            id: m.id || m.movie_id,
            movie_id: m.movie_id || m.id,
        }))
    }

    const ids = raw.map((m) => m.movie_id || m.id).filter(Boolean)
    const fetched = await fetchMoviesByIds(ids)
    return fetched
}

export default function MovieList() {
    const { listId } = useParams<{ listId: string }>()
    const { user } = useAuth()
    const [movies, setMovies] = useState<SimpleMovie[]>([])
    const [listName, setListName] = useState<string>("")
    const [isOwner, setIsOwner] = useState(false)
    const [ownerUserName, setOwnerUserName] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchListData = async () => {
            if (!listId) return
            setIsLoading(true)
            try {
                const data = await getListById(listId)
                setListName(data.list.name)
                setIsOwner(data.isOwner)
                setOwnerUserName(data.ownerUserName)
                const hydrated = await hydrateMovies(data.list.movies || [])
                setMovies(hydrated)
            } catch (error) {
                console.error("Error fetching list data:", error)
                toast.error("Failed to fetch list data. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchListData()
    }, [user, listId])

    const handleAddMovie = async (movie: SimpleMovie) => {
        if (!user?.uid || !listId || !isOwner) return
        try {
            await addMovieToList(listId, movie)
            setMovies((prevMovies) => [
                ...prevMovies,
                {
                    ...movie,
                    movie_id: movie.id || movie.movie_id,
                    id: movie.id || movie.movie_id,
                },
            ])
            setIsSearchOpen(false)
            toast.success(`"${movie.title}" has been added to your list.`)
        } catch (error) {
            console.error("Error adding movie to list:", error)
            toast.error("Failed to add movie to the list. Please try again.")
        }
    }

    const handleRemoveMovie = async (movieId: string) => {
        if (!user?.uid || !listId || !isOwner) return
        try {
            await removeMovieFromList(listId, movieId)
            setMovies((prevMovies) =>
                prevMovies.filter((movie) => movie.movie_id !== movieId)
            )
            toast.success("Movie removed from your list.")
        } catch (error) {
            console.error("Error removing movie from list:", error)
            toast.error(
                "Failed to remove movie from the list. Please try again."
            )
        }
    }

    const handleGoBack = () => {
        if (!isOwner && ownerUserName) {
            navigate(`/user/${ownerUserName}`)
            return
        }
        navigate("/lists")
    }

    if (isLoading) {
        return <FullPageLoader message="Loading list..." />
    }

    return (
        <div className="min-h-screen max-h-screen w-full overflow-auto p-8 text-white scrollbar-hide">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex w-full items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="truncate text-3xl font-bold md:text-4xl">
                            {listName || "Movie List"}
                        </h1>
                        {!isOwner && ownerUserName ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                                by{" "}
                                <button
                                    type="button"
                                    className="text-electric hover:underline"
                                    onClick={() =>
                                        navigate(`/user/${ownerUserName}`)
                                    }
                                >
                                    {ownerUserName}
                                </button>
                            </p>
                        ) : null}
                    </div>
                    <div className="flex shrink-0 space-x-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 rounded-full hover:bg-slate-500"
                            onClick={handleGoBack}
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        {isOwner ? (
                            <Dialog
                                open={isSearchOpen}
                                onOpenChange={setIsSearchOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-10 w-10 rounded-full hover:bg-slate-500"
                                    >
                                        <Plus className="h-6 w-6" />
                                        <span className="sr-only">
                                            Add movie
                                        </span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="text-white">
                                    <h2 className="mb-4 text-center text-lg font-semibold md:text-start">
                                        Add a Movie to Your List
                                    </h2>
                                    <MovieSearch onSelectMovie={handleAddMovie} />
                                </DialogContent>
                            </Dialog>
                        ) : null}
                    </div>
                </div>

                {movies.length === 0 ? (
                    <div className="rounded-[4px] border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
                        {isOwner
                            ? "This list is empty. Add a movie to get started."
                            : "This list is empty."}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.movie_id}
                                movie_id={movie.movie_id}
                                title={movie.title}
                                release_date={movie.release_date}
                                poster_path={movie.poster_path}
                                onRemove={
                                    isOwner
                                        ? () =>
                                              handleRemoveMovie(movie.movie_id)
                                        : undefined
                                }
                            />
                        ))}
                        {isOwner ? (
                            <Card className="relative mx-auto h-60 w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 sm:h-60 sm:max-w-40 md:h-72 md:max-w-48 lg:h-84 lg:max-w-56">
                                <CardContent className="flex h-[256px] items-center justify-center p-0">
                                    <div
                                        className="p-4 text-center"
                                        onClick={() => setIsSearchOpen(true)}
                                    >
                                        <Plus className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Add Movie
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}
