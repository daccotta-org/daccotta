// import { SimpleMovie, TMDBMovie } from "../Types/Movie";
// import { fetchDataFromApi } from "./tmdbServices";

// interface TMDBResponse {
//   results: TMDBMovie[];
//   // You can add other properties if needed, like:
//   // page: number;
//   // total_results: number;
//   // total_pages: number;
// }

// export const searchMovies = async (query: string): Promise<SimpleMovie[]> => {
//   const data = await fetchDataFromApi('/search/movie', { query }) as TMDBResponse;
//   return data.results.map((movie: TMDBMovie) => ({
//     id: movie.id.toString(),
//     title: movie.title,
//     poster_path: movie.poster_path,
//     release_date: movie.release_date,
//   }));
// };

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SimpleMovie, TMDBMovie } from "../Types/Movie";

const TMDB_TOKEN = import.meta.env.VITE_ACCESS_KEY;

export const searchMovies = async (query: string): Promise<SimpleMovie[]> => {
  if (query.length < 3) return [];

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    return data.results.map((movie: TMDBMovie) => ({
      id: movie.id.toString(),
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }));
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ["searchMovies", query],
    queryFn: () => searchMovies(query),
    enabled: query.length >= 3,
  });
};
