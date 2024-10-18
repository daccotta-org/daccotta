import React, { useEffect, useState } from "react"
import MovieCard from "./MovieCard"
import { MovieListType, useMovieList } from "@/services/movieService"
import { useJournal } from "@/services/journalService"
import { calculateTopGenres, genreMap } from "@/lib/stats"
import { useAuth } from "@/hooks/useAuth"
import { getUserData } from "@/services/userService"
import { SimpleMovie } from "@/Types/Movie"
import { ChevronRight } from "lucide-react"

interface List {
    list_id: string
    name: string
    movies: SimpleMovie[]
}

interface UserData {
    lists: List[]
}

interface MovieListProps {
    type: MovieListType
    heading: string
    genre?: string
    year?: string
    noFavGenre?: boolean
}

const MovieList: React.FC<MovieListProps> = ({
    type,
    heading,
    noFavGenre = false,
}) => {
    const { user } = useAuth()
    const { data: movies, isLoading, error } = useMovieList(type, 1)
    const [hoveredList, setHoveredList] = useState<string | null>(null)

    const { useGetJournalEntries } = useJournal()
    const { data: journalEntries } = useGetJournalEntries()
    const [favGenre, setFavGenre] = useState<number | null>(null)
    const [favGenreMovies, setFavGenreMovies] = useState<SimpleMovie[]>([])
    const { data: favoriteGenreMovies, isLoading: isFavGenreLoading } =
        useMovieList("discover", 1, favGenre || undefined)

    const handleScroll = (containerId: string) => {
        const container = document.getElementById(containerId)
        if (container) {
            const cardWidth = 256 // This is the lg:w-64 value
            const gap = 16 // This is the gap-4 value
            const scrollAmount = (cardWidth + gap) * 4 // Scroll 4 cards at a time
            container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    useEffect(() => {
        const fetchFavoriteGenre = async () => {
            if (journalEntries && journalEntries.length > 0) {
                const topGenres = calculateTopGenres(journalEntries)
                const getGenreIdByName = (genreName: string): number | null => {
                    const genreEntry = Object.entries(genreMap).find(
                        ([, name]) =>
                            name.toLowerCase() === genreName.toLowerCase()
                    )
                    return genreEntry ? parseInt(genreEntry[0]) : null
                }

                const topGenre: number | null = getGenreIdByName(
                    topGenres[0]?.genre || ""
                )
                setFavGenre(topGenre)
            } else if (user?.uid) {
                try {
                    const userData: UserData = await getUserData(user.uid)

                    const topMovies =
                        userData.lists.find((l) => l.name === "Top 5 Movies")
                            ?.movies || []
                    if (topMovies.length > 0) {
                        const genres = topMovies
                            .flatMap((movie) => movie.genre_ids)
                            .filter(Boolean)

                        const genreCounts = genres.reduce(
                            (acc, genre) => {
                                acc[genre!] = (acc[genre!] || 0) + 1
                                return acc
                            },
                            {} as Record<number, number>
                        )

                        const maxCount = Math.max(...Object.values(genreCounts))

                        const topGenres = Object.entries(genreCounts)
                            .filter(([, count]) => count === maxCount)
                            .map(([genre]) => parseInt(genre))

                        const mostCommonGenre = Math.min(...topGenres)

                        setFavGenre(mostCommonGenre)
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }

        fetchFavoriteGenre()
    }, [journalEntries, user])

    useEffect(() => {
        if (favoriteGenreMovies) {
            setFavGenreMovies(favoriteGenreMovies)
        }
    }, [favoriteGenreMovies])

    if (isLoading || isFavGenreLoading)
        return <div className="text-center py-8">Loading...</div>
    if (error)
        return (
            <div className="text-center py-8 text-red-500">
                Error fetching movies
            </div>
        )

    const renderMovieList = (movieList: SimpleMovie[], title: string) => {
        const containerId = `movie-list-${title.replace(/\s+/g, "-").toLowerCase()}`

        return (
            <div className="w-full flex flex-col justify-start my-6 gap-1 items-start px-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <div
                    className="w-full relative"
                    onMouseEnter={() => setHoveredList(containerId)}
                    onMouseLeave={() => setHoveredList(null)}
                >
                    <div
                        id={containerId}
                        className="w-full overflow-x-auto scrollbar-hide scroll-smooth"
                    >
                        <div className="flex flex-nowrap gap-4 pb-4">
                            {movieList?.map((movie) => (
                                <div
                                    key={movie.movie_id}
                                    className="flex-shrink-0"
                                >
                                    <MovieCard
                                        poster_path={movie.poster_path}
                                        movie_id={movie.movie_id}
                                        title={movie.title}
                                        release_date={movie.release_date}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    {hoveredList === containerId && (
                        <button
                            onClick={() => handleScroll(containerId)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-l-lg hover:bg-black/80 transition-colors duration-200"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {favGenre &&
                !noFavGenre &&
                favGenreMovies.length > 0 &&
                renderMovieList(
                    favGenreMovies,
                    `Explore in ${genreMap[favGenre]}`
                )}
            {movies && renderMovieList(movies, heading)}
        </>
    )
}

export default MovieList
