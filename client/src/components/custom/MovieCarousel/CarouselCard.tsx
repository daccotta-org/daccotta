import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Film, User } from "lucide-react"
import { genreMap } from "@/lib/stats"
import { SimpleMovie } from "@/Types/Movie"
import LazyImage from "../LazyLoadImage/LazyImage"

const IMAGE_URL = "https://image.tmdb.org/t/p"

const CarouselCard: React.FC<SimpleMovie> = ({
    movie_id,
    friend,
    title,
    poster_path,
    backdrop_path,
    release_date,
    genre_ids,
}) => {
    const navigate = useNavigate()
    const genreNames = genre_ids
        ?.map((id) => genreMap[id])
        .filter(Boolean)
        .slice(0, 3)

    const handleClick = () => {
        console.log("movie_id:", movie_id)
        navigate(`/movie/${movie_id}`)
    }

    return (
        <motion.div
            id={movie_id}
            className="carousel-item relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center rounded-lg overflow-hidden cursor-pointer"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%), url(${IMAGE_URL}/w1280${backdrop_path})`,
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center p-4 sm:p-6 md:p-8">
                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 z-10 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LazyImage
                        src={`${IMAGE_URL}/w300${poster_path}`}
                        alt={title || "Movie Poster"}
                        className="w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] h-auto rounded-lg shadow-2xl"
                    />
                    <div className="text-white flex-1">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 leading-tight">
                            {title}
                        </h2>
                        <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-4">
                            <div className="flex items-center">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="text-xs sm:text-sm">
                                    {release_date}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Film className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="text-xs sm:text-sm">
                                    {genreNames?.join(", ")}
                                </span>
                            </div>
                        </div>
                        {friend && (
                            <div className="flex items-center mt-1 sm:mt-2">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="text-xs sm:text-sm">
                                    Watched by{" "}
                                    <span className="font-semibold text-red-400">
                                        {friend}
                                    </span>
                                </span>
                            </div>
                        )}
                        <motion.button
                            className="mt-4 sm:mt-6 px-4 sm:px-6 py-1 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-full flex items-center hover:bg-red-700 transition-colors hidden sm:flex"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Details
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default CarouselCard
