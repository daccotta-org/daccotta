

import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleMovie } from "@/Types/Movie"
import { getUserData, addMovieToList } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import MovieSearch from "./MovieSearch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import MovieCard from "@/components/custom/MovieCard/MovieCard"

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
    const [hoveredMovie, setHoveredMovie] = useState<SimpleMovie | null>(null)

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie, index) => (
                        // <div
                        //     key={movie.id}
                        //     className="relative w-full h-full"
                        //     onMouseEnter={() => setHoveredMovie(movie)}
                        //     onMouseLeave={() => setHoveredMovie(null)}
                        // >
                        //     <img
                        //         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        //         alt={`${movie.title} poster`}
                        //         className="w-full h-full rounded-lg shadow-lg"
                        //     />
                        //     {hoveredMovie === movie && (
                        //         // <div className="absolute inset-0 bg-black flex items-center justify-center rounded-lg bg-opacity-75 transition-opacity duration-300">
                        //         //     <div className="text-center p-2">
                        //         //         <h3 className="text-lg font-bold">{movie.title}</h3>
                        //         //         <p className="text-sm text-gray-300">{movie.release_date?.split("-")[0]}</p>
                        //         //         <div className="flex items-center justify-center mt-2">
                        //         //             {[...Array(5)].map((_, i) => (
                        //         //                 <Star
                        //         //                     key={i}
                        //         //                     className={`w-5 h-5 ${
                        //         //                         i < Math.floor(10 / 2)
                        //         //                             ? "text-yellow-400 fill-current"
                        //         //                             : "text-gray-400"
                        //         //                     }`}
                        //         //                 />
                        //         //             ))}
                        //         //         </div>
                        //         //     </div>
                        //         // </div>
                        //         <motion.div
                        //             className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                        //             initial={{ opacity: 0 }}
                        //             whileHover={{ opacity: 1 }}
                        //         >
                        //             <div className="bottom-0">
                        //                 <h3 className="text-lg font-bold">
                        //                     {movie.title}
                        //                 </h3>
                        //                 <p className="text-sm text-gray-300">
                        //                     {movie.release_date?.split("-")[0]}
                        //                 </p>
                        //             </div>
                        //         </motion.div>
                        //     )}
                        // </div>
                        <MovieCard
                         movie_id={movie.movie_id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                        />
                    ))}
                    <Card className="overflow-hidden border-dashed w-[200px]">
                        <CardContent className="p-0 flex items-center justify-center h-[256px] ">
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
        </div>
    )
}
