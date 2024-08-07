import { fetchDataFromApi } from "./tmdbServices";

// Define an interface for the movie data returned by TMDB
interface TMDBMovie {
  id: number;
  title: string;
  // Add other properties you might need, e.g.:
  poster_path?: string | null;
   release_date?: string | null;
   overview: string;
}

// Define an interface for our simplified movie object
interface SimpleMovie {
  id: string;
  title: string;
  
}

// Define the structure of the TMDB API response
interface TMDBResponse {
  results: TMDBMovie[];
  // You can add other properties if needed, like:
  // page: number;
  // total_results: number;
  // total_pages: number;
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