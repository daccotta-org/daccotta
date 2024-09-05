import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SimpleMovie, TMDBMovie } from "../Types/Movie"

const TMDB_TOKEN = import.meta.env.VITE_ACCESS_KEY

const BASE_URL = "https://api.themoviedb.org/3"
export const searchMovies = async (query: string): Promise<SimpleMovie[]> => {
    if (query.length < 3) return []

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`

    try {
        const { data } = await axios.get(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
            },
        })

        return data.results.map((movie: TMDBMovie) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
        }))
    } catch (error) {
        console.error("Error searching movies:", error)
        return []
    }
}

export const useSearchMovies = (query: string) => {
    return useQuery({
        queryKey: ["searchMovies", query],
        queryFn: () => searchMovies(query),
        enabled: query.length >= 3,
    })
}

export type MovieListType = "popular" | "upcoming" | "now_playing" | "top_rated"

const fetchMovieList = async (
    type: MovieListType,
    page: number = 1
): Promise<SimpleMovie[]> => {
    const url = `${BASE_URL}/movie/${type}?page=${page}`

    try {
        const { data } = await axios.get(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
            },
        })

        return data.results.map((movie: TMDBMovie) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
        }))
    } catch (error) {
        console.error(`Error fetching ${type} movies:`, error)
        throw error
    }
}

export const useMovieList = (type: MovieListType, page: number = 1) => {
    return useQuery({
        queryKey: ["movieList", type, page],
        queryFn: () => fetchMovieList(type, page),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
