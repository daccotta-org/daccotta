import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleMovie } from "@/Types/Movie"
import { getUserData, addMovieToList } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import MovieSearch from "./MovieSearch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"

interface List {
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

    return (
        <div className="max-h-screen overflow-auto scrollbar-hide mx-auto px-4 py-8">
            <div className="flex justify-between w-full items-center mb-6">
                <h1 className="text-3xl font-bold text-white ">
                    {listName || "My Movie List"}
                </h1>
                <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <DialogTrigger asChild className="">
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full w-10 h-10"
                        >
                            <Plus className="h-6 w-6" />
                            <span className="sr-only">Add movie</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <h2 className="text-lg font-semibold mb-4">
                            Add a Movie to Your List
                        </h2>
                        <MovieSearch onSelectMovie={handleAddMovie} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <Card key={movie.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="aspect-[2/3] relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={`${movie.title} poster`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold truncate text-sm">
                                    {movie.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {movie.release_date?.split("-")[0]}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Card className="overflow-hidden border-dashed">
                    <CardContent className="p-0 flex items-center justify-center h-full ">
                        <div
                            className="text-center p-4"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Add Movie
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
