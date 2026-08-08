import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import {
    Heart,
    Star,
    Bookmark,
    Youtube,
    Tv,
    ChartNoAxesColumnDecreasingIcon,
    CalendarHeartIcon,
    VenetianMaskIcon,
} from "lucide-react"
import LazyImage from "@/components/custom/LazyLoadImage/LazyImage"
import { useAuth } from "@/hooks/useAuth"
import { useMovieProviders, useMovieDetails } from "@/services/movieService"
import {
    addMovieToList,
    createList,
    getUserData,
    removeMovieFromList,
} from "@/services/userService"
import { SimpleMovie } from "@/Types/Movie"
import { List } from "../List/MovieList"
import Loader from "../../components/ui/Loader"

const image_url = "https://image.tmdb.org/t/p"

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block border border-border rounded-[4px] px-3 py-1 text-sm font-medium text-foreground mr-2 mb-2">
        {children}
    </span>
)

const MovieDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [isFavourite, setIsFavourite] = useState(false)
    const [isInWatchList, setIsInWatchList] = useState(false)
    const { user } = useAuth()

    const { data: movie, isLoading: isMovieLoading } = useMovieDetails(id!)
    const { data: providers, isLoading: isProvidersLoading } =
        useMovieProviders(id!)
    const [favouriteLoading, setFavouriteLoading] = useState(false)
    const [watchListLoading, setWatchListLoading] = useState(false)

    useEffect(() => {
        const checkFavouriteStatus = async () => {
            if (user?.uid && movie) {
                const userData = await getUserData(user.uid)
                const favouritesList = userData.lists.find(
                    (list: List) => list.name === "Favourites"
                )
                if (favouritesList) {
                    setIsFavourite(
                        favouritesList.movies.some(
                            (m: SimpleMovie) => m.movie_id === id
                        )
                    )
                }
            }
        }

        checkFavouriteStatus()
    }, [id, user, movie])

    const handleFavouriteClick = async () => {
        if (!user) {
            toast.error("Please log in to manage your Favourites.")
            return
        }

        if (!movie) return
        setFavouriteLoading(true)
        try {
            const userData = await getUserData(user.uid)
            let favouritesList = userData.lists.find(
                (list: List) => list.name === "Favourites"
            )

            if (!favouritesList) {

                const createListData = {
                    name: "Favourites",
                    description: "My favourite movies",
                    isPublic: true,
                }

                const newList = await createList(user.uid, {
                    ...createListData,
                    list_type: "user",
                })

                favouritesList = newList.list;
            }

            if (isFavourite) {
                await removeMovieFromList(favouritesList.list_id, movie.id)
                setIsFavourite(false)
                toast.success(
                    `${movie.title} has been removed from your Favourites.`
                )
            }
            else {
                const movieToAdd = {
                    id: id!,
                    movie_id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    genre_ids: movie.genres.map((genre: any) => genre.id),
                }
                await addMovieToList(favouritesList.list_id, movieToAdd)
                setIsFavourite(true)
                toast.success(
                    `${movie.title} has been added to your Favourites.`
                )
            }
        } catch (error) {
            console.error("Error managing movie in Favourites:", error)
            toast.error("Failed to manage movie. Please try again.")
        } finally {
            setFavouriteLoading(false)
        }
    }

    useEffect(() => {
        const checkWatchListStatus = async () => {
            if (user?.uid && movie) {
                const userData = await getUserData(user.uid)
                const watchList = userData.lists.find(
                    (list: List) => list.name === "WatchList"
                )
                if (watchList) {
                    setIsInWatchList(
                        watchList.movies.some(
                            (m: SimpleMovie) => m.movie_id === id
                        )
                    )
                }
            }
        }

        checkWatchListStatus()
    }, [id, user, movie])

    const handleWatchListClick = async () => {
        if (!user) {
            toast.error("Please log in to manage your watchlists.")
            return
        }

        if (!movie) return
        setWatchListLoading(true)
        try {
            const userData = await getUserData(user.uid)
            let watchList = userData.lists.find(
                (list: List) => list.name === "WatchList"
            )

            if (!watchList) {
                const createListData = {
                    name: "WatchList",
                    description: "My WatchList",
                    isPublic: true,
                }
                const newList = await createList(user.uid, {
                    ...createListData,
                    list_type: "user",
                })

                watchList = newList.list;
            }

            if (isInWatchList) {
                // Remove movie from watchlist if already added
                await removeMovieFromList(watchList.list_id, movie.id)
                console.log("")
                setIsInWatchList(false)
                toast.success(
                    `${movie.title} has been removed from your WatchList.`
                )
            } else {
                // Add movie to watchlist if not already added
                const movieToAdd = {
                    id: id!,
                    movie_id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    genre_ids: movie.genres.map((genre: any) => genre.id),
                }
                await addMovieToList(watchList.list_id, movieToAdd)
                setIsInWatchList(true)
                toast.success(
                    `${movie.title} has been added to your WatchList.`
                )
            }
        } catch (error) {
            console.error("Error managing movie in WatchList:", error)
            toast.error("Failed to manage movie. Please try again.")
        } finally {
            setWatchListLoading(false)
        }
    }

    if (isMovieLoading || isProvidersLoading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#0A0A0B]/80 z-50">
                <div className="border-4 border-electric border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        )
    }

    if (!movie) {
        return (
            <div className="flex justify-center items-center h-screen text-muted-foreground">
                Movie not found
            </div>
        )
    }

    const director =
        movie.credits?.crew.find((person: any) => person.job === "Director")
            ?.name || "Unknown"
    const firstRentProvider = providers?.rent?.[0]
    const firstBuyProvider = providers?.buy?.[0]

    return (
        <div
            className="max-h-screen overflow-auto text-foreground bg-cover bg-center bg-fixed py-10"
            style={{
                backgroundImage: `linear-gradient(rgba(10, 10, 11, 0.85), rgba(10, 10, 11, 0.92)), url(${image_url}/original${movie.backdrop_path})`,
                width: `100%`,
            }}
        >
            <div className="container mx-auto px-4">
                <div className="bg-[#0A0A0B]/60 border border-border rounded-[4px] overflow-hidden backdrop-blur-md">
                    <div className="md:flex">
                        <div className="md:w-1/3 lg:w-1/4">
                            <LazyImage
                                src={`${image_url}/w500${movie.poster_path}`}
                                alt={`${movie.title} poster`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight uppercase">
                                    {movie.title}
                                </h1>
                                <div className="flex space-x-2 shrink-0">
                                    <button
                                        className={`p-2.5 rounded-full border transition-colors ${isFavourite ? "bg-primary border-primary text-primary-foreground" : "border-border bg-transparent text-foreground hover:border-primary"}`}
                                        onClick={handleFavouriteClick}
                                        disabled={favouriteLoading}
                                        aria-label="Toggle favourite"
                                    >
                                        {favouriteLoading ? (
                                            <Loader />
                                        ) : (
                                            <Heart
                                                className={`w-5 h-5 ${isFavourite ? "fill-current" : ""}`}
                                            />
                                        )}
                                    </button>
                                    <button
                                        className={`p-2.5 rounded-full border transition-colors ${isInWatchList ? "bg-electric border-electric text-[#0A0A0B]" : "border-border bg-transparent text-foreground hover:border-electric"}`}
                                        onClick={handleWatchListClick}
                                        disabled={watchListLoading}
                                        aria-label="Toggle watchlist"
                                    >
                                        {watchListLoading ? (
                                            <Loader />
                                        ) : (
                                            <Bookmark
                                                className={`w-5 h-5 ${isInWatchList ? "fill-current" : ""}`}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                {movie.tagline}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <div className="flex items-center bg-warning text-[#0A0A0B] px-3 py-1 rounded-[4px]">
                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                    <span className="font-bold text-sm">
                                        IMDb {movie.vote_average.toFixed(1)}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {Math.floor(movie.runtime / 60)}h{" "}
                                    {movie.runtime % 60}m
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {movie.release_date
                                        ? new Date(
                                              movie.release_date
                                          ).getFullYear()
                                        : "- -"}
                                </div>
                            </div>

                            <div className="mb-4">
                                {movie.genres.map((genre: any) => (
                                    <Badge key={genre.id}>{genre.name}</Badge>
                                ))}
                            </div>

                            <p className="text-base md:text-lg mb-6 text-foreground/90 leading-relaxed">
                                {movie.overview}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="flex items-center gap-1 text-muted-foreground text-sm uppercase tracking-wide">
                                        <ChartNoAxesColumnDecreasingIcon className="w-4 h-4 text-electric" />
                                        Status
                                    </span>
                                    <p className="mt-1">{movie.status}</p>
                                </div>
                                <div>
                                    <span className="flex items-center text-muted-foreground text-sm uppercase tracking-wide gap-1">
                                        <CalendarHeartIcon className="w-4 h-4 text-electric" />
                                        Release Date
                                    </span>
                                    <p className="mt-1">
                                        {movie.release_date
                                            ? new Date(
                                                  movie.release_date
                                              ).toLocaleDateString()
                                            : "Not released yet"}
                                    </p>
                                </div>
                                <div>
                                    <span className="flex items-center gap-1 text-muted-foreground text-sm uppercase tracking-wide py-1">
                                        <VenetianMaskIcon className="w-4 h-4 text-primary" />
                                        Director
                                    </span>
                                    <p className="mt-1">{director}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {firstRentProvider && (
                                    <button
                                        className="flex items-center border border-border bg-transparent text-foreground px-4 py-2 rounded-[4px] hover:bg-surface transition-colors"
                                        onClick={() =>
                                            window.open(
                                                providers?.link,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <img
                                            src={`${image_url}/w45${firstRentProvider.logo_path}`}
                                            alt={
                                                firstRentProvider.provider_name
                                            }
                                            className="w-6 mr-2 rounded-[2px]"
                                        />
                                        Rent
                                    </button>
                                )}
                                {firstBuyProvider && (
                                    <button
                                        className="flex items-center border border-border bg-transparent text-foreground px-4 py-2 rounded-[4px] hover:bg-surface transition-colors"
                                        onClick={() =>
                                            window.open(
                                                providers?.link,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <img
                                            src={`${image_url}/w45${firstBuyProvider.logo_path}`}
                                            alt={firstBuyProvider.provider_name}
                                            className="w-6 mr-2 rounded-[2px]"
                                        />
                                        Buy
                                    </button>
                                )}
                                <button
                                    className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-[4px] hover:bg-primary/90 transition-colors"
                                    onClick={() =>
                                        window.open(
                                            `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <Youtube className="w-5 mr-2" />
                                    Watch Trailer
                                </button>
                                <button
                                    className="flex items-center border border-border bg-transparent text-foreground px-4 py-2 rounded-[4px] hover:bg-surface transition-colors"
                                    onClick={() =>
                                        window.open(
                                            `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <Tv className="w-5 mr-2" />
                                    Apple TV
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-border">
                        <h3 className="font-heading text-sm font-bold mb-6 uppercase tracking-[0.15em] text-muted-foreground">
                            The Cast
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {movie.credits?.cast
                                .slice(0, 6)
                                .map((castMember: any) => (
                                    <div
                                        key={castMember.id}
                                        className="text-center"
                                    >
                                        <LazyImage
                                            src={`${image_url}/w200${castMember.profile_path}`}
                                            alt={castMember.name}
                                            className="rounded-full mx-auto mb-3 w-20 h-20 object-cover border border-border"
                                        />
                                        <p className="font-heading font-semibold text-sm">
                                            {castMember.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                                            {castMember.character}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetailPage
