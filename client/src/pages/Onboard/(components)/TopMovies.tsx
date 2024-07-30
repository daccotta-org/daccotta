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
    <div>
      <h2>Select Your Top 5 Movies</h2>
      <input
        type="text"
        placeholder="Search movies"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {movies?.map((movie) => (
            <li key={movie.id}>
              {movie.title}
              <button onClick={() => handleAddMovie(movie.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Your Top Movies:</h3>
        <ul>
          {topMovies.map((movieId) => (
            <li key={movieId}>{movieId}</li>
          ))}
        </ul>
      </div>
      {errors.topMovies && <span>{errors.topMovies.message}</span>}
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default TopMovies;
