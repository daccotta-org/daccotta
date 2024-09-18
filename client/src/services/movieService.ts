import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SimpleMovie, TMDBMovie } from "../Types/Movie"

const TMDB_TOKEN = import.meta.env.VITE_ACCESS_KEY

const BASE_URL = "https://api.themoviedb.org/3"
// movieService.ts

export const fetchMovieProviders = async (movieId: string) => {
    const url = `${BASE_URL}/movie/${movieId}/watch/providers`

    try {
        const { data } = await axios.get(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
            },
        })

        // Return providers for the country "IN"
        return data.results?.IN || null
    } catch (error) {
        console.error(`Error fetching movie providers:`, error)
        throw error
    }
}

export const useMovieProviders = (movieId: string) => {
    return useQuery({
        queryKey: ["movieProviders", movieId],
        queryFn: () => fetchMovieProviders(movieId),
        enabled: !!movieId,
    })
}

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

        return data.results.map((movie: SimpleMovie) => ({
            movie_id: movie.id?.toString(),
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            backdrop_path: movie.backdrop_path,
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

export const fetchMoviesByIds = async (
    movieIds: string[]
): Promise<SimpleMovie[]> => {
    try {
        const moviePromises = movieIds.map((id) =>
            axios.get(`${BASE_URL}/movie/${id}`, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                },
            })
        )

        const movieResponses = await Promise.all(moviePromises)

        return movieResponses.map((response) => {
            const movie: SimpleMovie = response.data
            return {
                id: movie.id?.toString(),
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                backdrop_path: movie.backdrop_path,
            }
        })
    } catch (error) {
        console.error("Error fetching movies by IDs:", error)
        throw error
    }
}
