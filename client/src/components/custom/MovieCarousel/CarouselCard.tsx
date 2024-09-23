import { AnimatePresence, motion } from "framer-motion"
import { FC, useState } from "react"
import LazyImage from "../LazyLoadImage/LazyImage"
import "./CarouselCard.css"
import { SimpleMovie } from "@/Types/Movie"
import { useNavigate } from "react-router-dom"
import { genreMap } from "@/lib/stats"
// export interface SimpleMovie {
//     movie_id: string // movie movie_id
//     release_date: string
//     friend?: string
//     title: string | undefined
//     overview: string
//     poster_path: string | undefined
//     backdrop_path: string
// }

const image_url = "https://image.tmdb.org/t/p"

const CarouselCard: FC<SimpleMovie> = ({
    movie_id,
    friend,
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    genre_ids,
}) => {
    const genreNames = genre_ids
        ?.map((id) => genreMap[id]) // map genre_ids to their respective names
        .filter(Boolean) // remove undefined genres in case there are any missing ids
        .slice(0, 3) //
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
    const handleClick = () => {
        console.log("movie_id :", movie_id)
        navigate(`/movie/${movie_id}`)
    }
    return (
        <div
            id={movie_id}
            className="roboto-regular  carousel-item relative w-full h-[300px]  bg-cover bg-center rounded-lg overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.9) 90%, rgba(0, 0, 0, 1)), url(${image_url}/w1280${backdrop_path})`,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-50 blur-sm"
                style={{
                    backdropFilter: "blur(5px)",
                }}
            ></div>
            <div className="absolute inset-0 flex items-center p-6 rounded-md">
                {/* Poster Image */}
                <LazyImage
                    src={`${image_url}/w300${poster_path}`}
                    alt={title || "Movie Poster"}
                    className="w-[150px] h-auto rounded-lg shadow-lg z-10"
                />
                {/* Movie Details */}
                <div className="ml-6 text-white z-10">
                    <h2 className="text-3xl font-bold font-heading">{title}</h2>
                    <div className="mt-4 flex space-x-4">
                        <button className="btn  btn-sm glass text-sm ">
                            {release_date}
                        </button>
                        {/* <button className="btn  btn-sm glass text-sm lg:w-fit  overflow-hidden">
                            <span className="lg:visible hidden "> Genre:</span>{" "}
                            {genre}
                        </button> */}
                        <button className="btn btn-sm glass text-sm lg:w-fit overflow-hidden">
                            <span className="lg:visible hidden">Genres:</span>
                            {/* Display the genre names */}
                            {genreNames?.join(", ")}
                        </button>
                    </div>
                    {/* //animate presence used to animate things which are entering
                    and leaving the viewport */}
                    {/* <AnimatePresence>
                        {isHovered && (
                            <motion.p
                                className="mt-4  text-lg max-w-3xl  h-[120px] overflow-auto scrollbar-hide "
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                            >
                                {overview}
                            </motion.p>
                        )}
                    </AnimatePresence> */}
                    {/* Release Date and Genre */}
                    {friend && (
                        <p className="mt-4 text-sm">
                            Watched by{" "}
                            <span className="btn btn-sm glass text-red-400 font-semibold">
                                {friend}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CarouselCard
