import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
const image_url = "https://image.tmdb.org/t/p"
interface MovieCardProps {
    poster_path: string | undefined
    movie_id: string
    title: string | undefined
    onRemove?: (movie_id: string) => void; // Optional remove handler
}

const MovieCard: React.FC<MovieCardProps> = ({
    poster_path,
    movie_id,
    title,
    onRemove,
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        console.log("movie_id", movie_id)
        navigate(`/movie/${movie_id}`);
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents triggering the handleClick
        if (onRemove) {
            onRemove(movie_id);
        }
    };

    return (
        <motion.div
            className="relative lg:w-48 lg:h-64 w-28 h-36 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 ease-in-out hover:scale-105"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            <motion.img
                src={`${image_url}/w300${poster_path}`}
                alt={title || "Movie Poster"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
            />
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
            >
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold truncate">
                        {title}
                    </h3>
                    {onRemove && (
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={handleRemove}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default MovieCard
