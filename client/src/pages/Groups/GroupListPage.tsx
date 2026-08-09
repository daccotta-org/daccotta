import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import FullPageLoader from "@/components/ui/FullPageLoader"
import MovieCard from "@/components/custom/MovieCard/MovieCard"
import MovieSearch from "@/pages/List/MovieSearch"
import { useGroups } from "@/services/groupsService"
import type { SimpleMovie } from "@/Types/Movie"

export default function GroupListPage() {
    const { groupId, listId } = useParams<{
        groupId: string
        listId: string
    }>()
    const navigate = useNavigate()
    const {
        useGetGroupList,
        useAddMovie,
        useRemoveMovie,
        getErrorMessage,
    } = useGroups()

    const { data, isLoading, error } = useGetGroupList(groupId, listId)
    const addMovie = useAddMovie(groupId!, listId!)
    const removeMovie = useRemoveMovie(groupId!, listId!)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    if (isLoading) {
        return <FullPageLoader message="Loading list..." />
    }

    if (error || !data) {
        return (
            <div className="p-8 text-white">
                List not found or you don&apos;t have access.
            </div>
        )
    }

    const { list, limits } = data
    const atCap = limits.movie_count >= limits.max_movies

    const handleAdd = async (movie: SimpleMovie) => {
        try {
            await addMovie.mutateAsync({
                movie_id: movie.movie_id || movie.id,
                title: movie.title || "Untitled",
                poster_path: movie.poster_path || "",
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
            })
            setIsSearchOpen(false)
            toast.success(`Added "${movie.title}"`)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to add movie"))
        }
    }

    const handleRemove = async (movieId: string) => {
        try {
            await removeMovie.mutateAsync(movieId)
            toast.success("Movie removed")
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to remove movie"))
        }
    }

    return (
        <div className="min-h-screen w-full overflow-auto p-6 text-white scrollbar-hide md:p-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    onClick={() => navigate(`/groups/${groupId}`)}
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to group
                </button>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{list.name}</h1>
                        {list.description ? (
                            <p className="mt-1 text-muted-foreground">
                                {list.description}
                            </p>
                        ) : null}
                        <p className="mt-2 text-sm text-muted-foreground">
                            {limits.movie_count} / {limits.max_movies} movies
                        </p>
                    </div>

                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={atCap}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add movie
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <MovieSearch onSelectMovie={handleAdd} />
                        </DialogContent>
                    </Dialog>
                </div>

                {!list.movies.length ? (
                    <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
                        No movies yet. Anyone in the group can add some.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {list.movies.map((movie) => (
                            <MovieCard
                                key={movie.movie_id}
                                movie_id={movie.movie_id}
                                title={movie.title}
                                poster_path={movie.poster_path}
                                release_date={movie.release_date}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
