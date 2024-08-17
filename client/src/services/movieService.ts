import { SimpleMovie, TMDBMovie } from "../Types/Movie";
import { fetchDataFromApi } from "./tmdbServices";


interface TMDBResponse {
  results: TMDBMovie[]; 
}

export const searchMovies = async (query: string): Promise<SimpleMovie[]> => {
  const data = await fetchDataFromApi('/search/movie', { query }) as TMDBResponse;
  return data.results.map((movie: TMDBMovie) => ({
    id: movie.id.toString(),
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
  }));
};

