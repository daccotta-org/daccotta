import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleMovie } from "@/Types/Movie"
import { getUserData, addMovieToList, removeMovieFromList } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import MovieSearch from "./MovieSearch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import MovieCard from "@/components/custom/MovieCard/MovieCard"

export interface List {
    list_id: string
    name: string
    movies: SimpleMovie[]
}

interface UserData {
    lists: List[]
}

export default function MovieList() {
    const { listId } = useParams<{ listId: string }>()
    const { user } = useAuth()
    const [movies, setMovies] = useState<SimpleMovie[]>([])
    const [listName, setListName] = useState<string>("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const fetchListData = async () => {
            if (user?.uid && listId) {
                try {
                    const userData: UserData = await getUserData(user.uid)
                    const list = userData.lists.find(
                        (l: List) => l.list_id === listId
                    )
                    if (list) {
                        setListName(list.name)
                        setMovies(list.movies)
                    }
                } catch (error) {
                    console.error("Error fetching list data:", error)
                    toast.error("Failed to fetch list data. Please try again.")
                }
            }
        }

        fetchListData()
    }, [user, listId])

    const handleAddMovie = async (movie: SimpleMovie) => {
        if (user?.uid && listId) {
            try {
                await addMovieToList(listId, movie)
                setMovies((prevMovies) => [...prevMovies, movie])
                setIsSearchOpen(false)
                toast.success(`"${movie.title}" has been added to your list.`)
            } catch (error) {
                console.error("Error adding movie to list:", error)
                toast.error(
                    "Failed to add movie to the list. Please try again."
                )
            }
        }
    }

    const handleRemoveMovie = async (movieId: string) => {
        if (user?.uid && listId) {
            try {
                await removeMovieFromList(listId, movieId)
                setMovies((prevMovies) => prevMovies.filter(movie => movie.movie_id !== movieId))
                toast.success("Movie removed from your list.")
            } catch (error) {
                console.error("Error removing movie from list:", error)
                toast.error("Failed to remove movie from the list. Please try again.")
            }
        }
    }

    return (
        <div className="min-h-screen text-white p-8 max-h-screen overflow-auto scrollbar-hide w-full">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between w-full items-center mb-6">
                    <h1 className="text-4xl font-bold">
                        {listName || "My Movie List"}
                    </h1>
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-10 h-10 hover:bg-slate-500"
                            >
                                <Plus className="h-6 w-6" />
                                <span className="sr-only">Add movie</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <h2 className="text-lg font-semibold mb-4 text-center md:text-start">
                                Add a Movie to Your List
                            </h2>
                            <MovieSearch onSelectMovie={handleAddMovie} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.movie_id} // Ensure you add a unique key prop
                            movie_id={movie.movie_id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                            onRemove={() => handleRemoveMovie(movie.movie_id)} // Pass the remove handler
                        />
                    ))}
                    <Card className="relative lg:w-48 lg:h-64 w-28 h-36 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 ease-in-out hover:scale-105">
                        <CardContent className="p-0 flex items-center justify-center h-[256px] ">
                            <div
                                className="text-center p-4"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground ">
                                    Add Movie
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
