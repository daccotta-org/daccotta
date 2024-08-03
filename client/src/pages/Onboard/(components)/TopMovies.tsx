import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../../services/movieService";

const topMoviesSchema = z.object({
  topMovies: z.array(z.string()).max(5),
});

type TopMoviesData = z.infer<typeof topMoviesSchema>;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const TopMovies: React.FC<Props> = ({ onNext, onPrevious }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TopMoviesData>();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', searchTerm],
    queryFn: () => searchMovies(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const topMovies = watch("topMovies");

  const handleAddMovie = (movieId: string) => {
    if (topMovies.length < 5) {
      setValue("topMovies", [...topMovies, movieId]);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-tr from-secondary to-primary shadow-lg rounded-lg max-w-md hover:ring-1">
      <h2 className="text-2xl font-bold mb-4">Select Your Top 5 Movies</h2>
      <input
        type="text"
        placeholder="Search movies"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="mb-4">
          {movies?.map((movie) => (
            <li key={movie.id} className="flex justify-between items-center mb-2">
              <span>{movie.title}</span>
              <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => handleAddMovie(movie.id)}>
                  Add
             </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Your Top Movies:</h3>
        <ul>
          {topMovies.map((movieId) => (
            <li key={movieId} className="mb-1">{movieId}</li>
          ))}
        </ul>
      </div>
      {errors.topMovies && <span className="text-red-500">{errors.topMovies.message}</span>}
      <div className="flex justify-between">
        <button  type="button"  className="btn btn-secondary" onClick={onPrevious}>Previous</button>
        <button  type="button"  className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default TopMovies;
