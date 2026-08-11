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
            className="carousel-item relative w-full aspect-[21/9] min-h-[280px] max-h-[620px] bg-cover bg-center overflow-hidden cursor-pointer"
            style={{
                backgroundImage: `linear-gradient(to top, rgba(10, 10, 11, 1) 0%, rgba(10, 10, 11, 0.75) 40%, rgba(10, 10, 11, 0.2) 70%, transparent 100%), url(${IMAGE_URL}/w1280${backdrop_path || poster_path})`,
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-6 md:p-10 lg:p-12">
                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8 z-10 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LazyImage
                        src={`${IMAGE_URL}/w300${poster_path}`}
                        alt={title || "Movie Poster"}
                        className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px] h-auto rounded-[4px] shadow-2xl border border-border"
                    />
                    <div className="text-foreground flex-1 pb-2">
                        {genreNames && genreNames.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {genreNames.slice(0, 2).map((genre) => (
                                    <span
                                        key={genre}
                                        className="border border-primary/70 text-foreground text-[10px] sm:text-xs uppercase tracking-wider px-2 py-0.5 rounded-[4px]"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight tracking-tight">
                            {title}
                        </h2>
                        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4 text-muted-foreground">
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
                            <div className="flex items-center mt-1 sm:mt-2 mb-3">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-muted-foreground" />
                                <span className="text-xs sm:text-sm text-muted-foreground">
                                    Watched by{" "}
                                    <span className="font-semibold text-primary">
                                        {friend}
                                    </span>
                                </span>
                            </div>
                        )}
                        <div className="hidden sm:flex items-center gap-3 mt-4">
                            <motion.button
                                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-[4px] flex items-center hover:bg-primary/90 transition-colors"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Watch Now
                                <ChevronRight className="w-4 h-4 ml-1.5" />
                            </motion.button>
                            <motion.button
                                className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-[4px] flex items-center hover:bg-surface transition-colors"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                + List
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default CarouselCard
