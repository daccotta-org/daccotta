import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../../services/movieService";

interface Movie {
  id: string;
  title: string;
  poster_path?: string;
  release_date?: string;
}

const topMoviesSchema = z.object({
  topMovies: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        poster_path: z.string().optional(),
        release_date: z.string().optional(),
      })
    )
    .max(5),
});

type TopMoviesData = z.infer<typeof topMoviesSchema>;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const TopMovies: React.FC<Props> = ({ onNext, onPrevious }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TopMoviesData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const {
    data: movies,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["movies", searchTerm],
    queryFn: () => searchMovies(searchTerm),
    enabled: false, // We'll manually trigger the query
  });

  useEffect(() => {
    if (searchTerm.length > 2) {
      refetch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, refetch]);

  useEffect(() => {
    if (movies) {
      setSearchResults(movies.slice(0, 3));
    }
  }, [movies]);

  const topMovies = watch("topMovies") || [];

  const handleAddMovie = (movie: Movie) => {
    if (topMovies.length < 5) {
      setValue("topMovies", [...topMovies,movie]);
      setSearchTerm("");
      setSearchResults([]);      
    }
    else{    
      alert("You can only select up to 5 movies");
      setSearchTerm("");
      setSearchResults([]);   
    }
    console.log(topMovies);
  };

  const handleRemoveMovie = (movieId: string) => {
    setValue(
      "topMovies",
      topMovies.filter((movie) => movie.id !== movieId)
    );
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg rounded-lg max-w-3xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Select Your Top 5 Movies
      </h2>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full bg-white text-gray-800"
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg ">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer border-b-2"
                onClick={() => handleAddMovie(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex flex-col">
                <span className="flex-grow text-sm">{movie.title}</span>
                <span className="text-xs">{movie.release_date?.slice(0,4)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Selected Movies:</h3>
        <ul className="space-y-4">
          {topMovies.map((movie) => (
            <li
              key={movie.id}
              className="flex items-center space-x-4 bg-white bg-opacity-10 p-1 rounded-lg"
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="w-12 h-12 object-cover rounded"
              />
              
                <span className="flex-grow text-sm">{movie.title}</span>
               
              <button
                type="button"
                className=""
                onClick={() => handleRemoveMovie(movie.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {errors.topMovies && (
        <span className="text-red-300 block mb-4">
          {errors.topMovies.message}
        </span>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TopMovies;
