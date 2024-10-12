import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { addMovieToList, createList, getUserData } from "@/services/userService";

const IMAGE_URL = "https://image.tmdb.org/t/p";

interface MovieCardProps {
  movie_id: string;
  title: string | undefined;
  poster_path: string | undefined;
  release_date: string | undefined;
  onRemove?: (movie_id: string) => void; // Optional remove handler
}

interface SimpleMovie {
  id: string;
  movie_id: string;
  title: string;
  poster_path: string;
  release_date: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie_id,
  title,
  poster_path,
  release_date,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserData(user.uid);
          const favouritesList = userData.lists.find(
            (list: any) => list.name === "Favourites"
          );
          if (favouritesList) {
            setIsFavourite(
              favouritesList.movies.some((m: any) => m.movie_id === movie_id)
            );
          }
        } catch (error) {
          console.error("Error checking favourite status:", error);
        }
      }
    };

    checkFavouriteStatus();
  }, [movie_id, user]);

  const handleClick = () => {
    navigate(`/movie/${movie_id}`);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the handleClick
    if (onRemove) {
        onRemove(movie_id);
    }
  };

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to add movies to your Favourites.");
      return;
    }

    // Validate required fields before proceeding
    if (!title || !poster_path || !release_date) {
      toast.error("Missing required movie information.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await getUserData(user.uid);
      let favouritesList = userData.lists.find(
        (list: any) => list.name === "Favourites"
      );

      if (!favouritesList) {
        const createListData = {
          name: "Favourites",
          description: "My favourite movies",
          isPublic: true,
        };
        favouritesList = await createList(user.uid, {
          ...createListData,
          list_type: "user",
        });
      }

      // Check if the movie is already in the favourites list
      const movieToAdd: SimpleMovie = {
        id: movie_id,
        movie_id: movie_id,
        title: title,
        poster_path: poster_path,
        release_date: release_date,
      };

      // Only add the movie if it's not already a favourite
      if (!isFavourite) {
        await addMovieToList(favouritesList.list_id, movieToAdd);
        setIsFavourite(true);
        toast.success(`${title} has been added to your Favourites.`);
      } else {
        toast.info(`${title} is already in your Favourites.`);
      }
    } catch (error) {
      console.error("Error adding movie to Favourites:", error);
      toast.error("Failed to add movie. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="relative w-32 sm:w-40 md:w-48 lg:w-56 h-48 sm:h-60 md:h-72 lg:h-84 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={`${IMAGE_URL}/w500${poster_path}`}
        alt={title || "Movie Poster"}
        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* <button
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isFavourite ? "bg-red-600 text-white" : "bg-white/50 text-black"
          } transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleFavouriteClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavourite ? "fill-current" : ""}`} />
          )}
        </button> */}

        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 flex flex-col items-center">
          <div className="flex items-center space-x-2 text-xs sm:text-sm mb-1">
            <span className="text-gray-300">{release_date?.split('-')[0]}</span>
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 line-clamp-2">
            {title}
          </h3>
        </div>
        {onRemove && (
            <div className="w-full flex justify-center">
                <button className="text-white-500 hover:text-red-700 font-bold"
                onClick={handleRemove}>Remove</button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
