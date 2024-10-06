import React, { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { useSearchMovies } from "../../../services/movieService"
import { RxCrossCircled } from "react-icons/rx"
import { toast } from "react-toastify"
import { Movie } from "../../../Types/Movie"
import { movieSchema } from "../../../Types/Movie"
import CircularIndeterminate from "@/components/ui/loading"

export const topMoviesSchema = z.object({
    topMovies: z.array(movieSchema).max(5),
})
type TopMoviesData = z.infer<typeof topMoviesSchema>

interface Props {
    onPrevious: () => void
    onSubmit: () => void
    isSubmitting: boolean
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const TopMovies: React.FC<Props> = ({
    onPrevious,
    onSubmit,
    isSubmitting,
    handleKeyDown,
}) => {
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<TopMoviesData>()
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<Movie[]>([])
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

    const { data: movies, isLoading, refetch } = useSearchMovies(searchTerm)

    useEffect(() => {
        if (searchTerm.length > 2) {
            refetch()
        } else {
            setSearchResults([])
        }
    }, [searchTerm, refetch])

    useEffect(() => {
        if (movies) {
            setSearchResults(movies.slice(0, 10))
        }
    }, [movies])

    const topMovies = watch("topMovies") || []

    useEffect(() => {
        setIsSubmitDisabled(topMovies.length < 2 || isSubmitting)
    }, [topMovies, isSubmitting])

    const handleAddMovie = (movie: Movie) => {
        const isDuplicate = topMovies.some((m) => m.id === movie.id)
        if (isDuplicate) {
            toast.warn("This movie is already in your top list.")
        } else if (topMovies.length < 5) {
            setValue("topMovies", [...topMovies, movie])
            toast.success("Movie added to your top list!")
        } else {
            toast.error("You can only select up to 5 movies")
        }
        setSearchTerm("")
        setSearchResults([])
    }

    const handleRemoveMovie = (movieId: string) => {
        setValue(
            "topMovies",
            topMovies.filter((movie) => movie.id !== movieId)
        )
        toast.info("Movie removed from your top list.")
    }

    const handleSubmit = () => {
        if (!isSubmitDisabled) {
            onSubmit()
        } else {
            if (topMovies.length < 2) {
                toast.error("Please select at least 2 movies to continue.")
            } else if (isSubmitting) {
                toast.info("Please wait, your selection is being submitted.")
            }
        }
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-5">
            <div className="lg:col-span-2 h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-md w-full space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Select Your Top 5 Movies
                    </h2>
                    <div className="mt-8 space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search movies"
                                value={searchTerm}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-black text-white"
                            />
                            {isLoading && (
                                <div className="mt-2">
                                    <p className="text-sm font-bold text-lime-500">
                                        Loading Please Wait
                                        <span className="inline-block animate-bounce">
                                            .
                                        </span>
                                        <span className="inline-block animate-bounce delay-150">
                                            .
                                        </span>
                                        <span className="inline-block animate-bounce delay-300">
                                            .
                                        </span>
                                        <span className="inline-block animate-bounce delay-300">
                                            .
                                        </span>
                                    </p>
                                </div>
                            )}
                            {searchResults.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-gray-800 text-white rounded-md shadow-lg max-h-60 overflow-auto">
                                    {searchResults.map((movie) => (
                                        <li
                                            key={movie.id}
                                            className="flex items-center space-x-4 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                                            onClick={() =>
                                                handleAddMovie(movie)
                                            }
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    {movie.title}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {movie.release_date?.slice(
                                                        0,
                                                        4
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {topMovies.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">
                                    Selected Movies:
                                </h3>
                                <ul className="space-y-4 max-h-60 overflow-auto">
                                    {topMovies.map((movie) => (
                                        <li
                                            key={movie.id}
                                            className="flex items-center space-x-4 bg-gray-800 p-2 rounded-lg"
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-16 h-20 object-cover rounded"
                                            />
                                            <span className="flex-grow text-sm">
                                                {movie.title}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMovie(movie.id!)
                                                }
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <RxCrossCircled size="24px" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {errors.topMovies && (
                            <span className="text-red-500 block">
                                {errors.topMovies.message}
                            </span>
                        )}
                        <div className="flex justify-between pt-10">
                            <button
                                type="button"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={onPrevious}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className={`px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    isSubmitDisabled
                                        ? "bg-gray-800 hover:bg-gray-700 cursor-not-allowed"
                                        : "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                }`}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:col-span-3 bg-[#FF204E] items-center justify-center">
                <img
                    src="/profile_page.svg"
                    alt="Sign Up Illustration"
                    className="w-[400px] h-auto"
                />
            </div>
            {isSubmitting && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-center">
                        <CircularIndeterminate />
                        <p className="mt-4 text-white">Submitting...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default TopMovies
