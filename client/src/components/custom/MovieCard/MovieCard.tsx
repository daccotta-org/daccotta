import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
const image_url = "https://image.tmdb.org/t/p"
interface MovieCardProps {
    poster_path: string | undefined
    movie_id: string | undefined
    title: string | undefined
}

const MovieCard: React.FC<MovieCardProps> = ({
    poster_path,
    movie_id,
    title,
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/movie/${movie_id}`)
    }

    return (
        <motion.div
            className="relative lg:w-48 lg:h-64 w-28 h-36 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 ease-in-out hover:scale-105"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            <motion.img
                src={`${image_url}/w300${poster_path}`}
                alt={title}
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
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-semibold truncate">
                        {title}
                    </h3>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default MovieCard
