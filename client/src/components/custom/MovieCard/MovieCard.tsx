import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ThumbsUp } from "lucide-react";
import LazyImage from "../LazyLoadImage/LazyImage";

const IMAGE_URL = "https://image.tmdb.org/t/p";

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

interface MovieCardProps {
  movie_id: string;
  title: string | undefined;
  poster_path: string | undefined;
  backdrop_path: string | undefined;
  release_date: string | undefined;
  genre_ids: number[] | undefined;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie_id,
  title,
  poster_path,
  backdrop_path,
  release_date,
  genre_ids,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    console.log("movie_id:", movie_id);
    navigate(`/movie/${movie_id}`);
  };

  const genreNames = genre_ids
    ?.map((id) => genreMap[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div 
      className="relative w-48 h-72"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LazyImage
          src={`${IMAGE_URL}/w300${poster_path}`}
          alt={title || "Movie Poster"}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="fixed w-64 bg-[#141414] rounded-md shadow-lg overflow-hidden cursor-pointer"
            style={{
              zIndex: 40,
              top: "50%",
              left: "50%",
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
          >
            <LazyImage
              src={`${IMAGE_URL}/w500${backdrop_path || poster_path}`}
              alt={title || "Movie Backdrop"}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <div className="flex space-x-2 mb-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="bg-white text-black rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add play functionality here
                  }}
                >
                  <Play size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="border border-gray-300 text-white rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to list functionality here
                  }}
                >
                  <Plus size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="border border-gray-300 text-white rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add like functionality here
                  }}
                >
                  <ThumbsUp size={20} />
                </motion.button>
              </div>
              <div className="text-white text-sm mb-2">
                <span className="text-green-500 font-bold mr-2">97% Match</span>
                <span>{release_date?.split('-')[0]}</span>
              </div>
              <div className="text-white text-sm mb-2">
                {genreNames?.join(" • ")}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieCard;