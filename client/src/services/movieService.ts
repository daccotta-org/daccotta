import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SimpleMovie, TMDBMovie } from "../Types/Movie"
import { config } from "@/lib/config"

const TMDB_TOKEN = config.tmdb.apiKey
const BASE_URL = config.tmdb.baseUrl
const DISCOVER_MOVIE_URL = `${config.tmdb.baseUrl}/discover/movie`
// movieService.ts

export const fetchMovieDetails = async (movieId: string) => {
    const url = `${BASE_URL}/movie/${movieId}?append_to_response=credits`
    try {
        const { data } = await axios.get(url, {
            params: {
                api_key: TMDB_TOKEN,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
            },
        })
        return data
    } catch (error) {
        console.error(`Error fetching movie details:`, error)
        throw error
    }
}
// New hook to use the fetchMovieDetails function
export const useMovieDetails = (movieId: string) => {
    return useQuery({
        queryKey: ["movieDetails", movieId],
        queryFn: () => fetchMovieDetails(movieId),
        enabled: !!movieId,
    })
}

export const useGetRecommendedMovies = (year: any, genre: any) => {
    return useQuery({
        queryKey: ["recommendedMovies", year, genre],
        queryFn: () => getRecommendedMovies(year, genre),
        enabled: !!year && !!genre, // Only fetch if both year and genre are provided
    })
}

export const getRecommendedMovies = async (year: number, genre: number) => {
    const url = `${DISCOVER_MOVIE_URL}?api_key=${TMDB_TOKEN}&primary_release_year=${year}&with_genres=${genre}&language=en-US&sort_by=release_date.desc&page=1`

    try {
        const response = await axios.get(url)
        return response.data.results.map((movie: TMDBMovie) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
        }))
    } catch (error) {
        console.error("Error fetching recommended movies:", error)
        throw error
    }
}

export const fetchMovieProviders = async (movieId: string) => {
    const url = `${BASE_URL}/movie/${movieId}/watch/providers`

    try {
        const { data } = await axios.get(url, {
            params: {
                api_key: TMDB_TOKEN,
            },
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

// export const searchMovies = async (query: string): Promise<SimpleMovie[]> => {
//     if (query.length < 3) return []

//     const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`

//     try {
//         const { data } = await axios.get(url, {
//             headers: {
//                 accept: "application/json",
//                 Authorization: `Bearer ${TMDB_TOKEN}`,
//             },
//         })
//         console.log("data :: ", data.results)
//         return data.results.map((movie: TMDBMovie) => ({
//             id: movie.id.toString(),
//             title: movie.title,
//             poster_path: movie.poster_path,
//             release_date: movie.release_date,
//             genre_ids: movie.genre_ids,
//         }))
//     } catch (error) {
//         console.error("Error searching movies:", error)
//         return []
//     }
// }

// export const useSearchMovies = (query: string) => {
//     return useQuery({
//         queryKey: ["searchMovies", query],
//         queryFn: () => searchMovies(query),
//         enabled: query.length >= 3,
//     })
// }
export const searchMovies = async (
    query: string,
    year?: number,
    genreId?: number,
    language?: string
): Promise<SimpleMovie[]> => {
    if (query.length < 3) return []
    let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`

    if (year) {
        url += `&year=${year}`
    }

    if (genreId) {
        url += `&with_genres=${genreId}`
    }

    if (language) {
        url += `&language=${language}`
    }

    try {
        const { data } = await axios.get(url, {
            params: {
                api_key: TMDB_TOKEN,
                query: query,
            },
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
            genre_ids: movie.genre_ids,
        }))
    } catch (error) {
        console.error("Error searching movies:", error)
        return []
    }
}

export const useSearchMovies = (
    query: string,
    year?: number,
    genreId?: number,
    language?: string
) => {
    return useQuery({
        queryKey: ["searchMovies", query, year, genreId, language],
        queryFn: () => searchMovies(query, year, genreId, language),
        enabled: query.length >= 3,
    })
}

export type MovieListType =
    | "popular"
    | "upcoming"
    | "now_playing"
    | "top_rated"
    | "discover"
interface FetchMovieListParams {
    type: MovieListType
    page?: number
    genre?: string | number
    startDate?: string
    endDate?: string
}

const fetchMovieList = async ({
    type,
    page = 1,
    genre,
    startDate,
    endDate,
}: FetchMovieListParams): Promise<SimpleMovie[]> => {
    let url = `${BASE_URL}/movie/${type}?page=${page}`

    if (type === "discover") {
        url = `${BASE_URL}/discover/movie?page=${page}`
        if (genre) url += `&with_genres=${genre}`
        if (startDate) url += `&primary_release_date.gte=${startDate}`
        if (endDate) url += `&primary_release_date.lte=${endDate}`
    }

    try {
        const { data } = await axios.get(url, {
            params: {
                api_key: TMDB_TOKEN,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
            },
        })

        return data.results.map(
            (movie: any): SimpleMovie => ({
                id: movie.id?.toString(),
                movie_id: movie.id?.toString(),
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                backdrop_path: movie.backdrop_path,
                genre_ids: movie.genre_ids,
            })
        )
    } catch (error) {
        console.error(`Error fetching ${type} movies:`, error)
        throw error
    }
}

export const useMovieList = (
    type: MovieListType,
    page: number = 1,
    genre?: string | number,
    startDate?: string,
    endDate?: string
) => {
    return useQuery({
        queryKey: ["movieList", type, page, genre, startDate, endDate],
        queryFn: () =>
            fetchMovieList({ type, page, genre, startDate, endDate }),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const fetchMoviesByIds = async (
    movieIds: string[]
): Promise<SimpleMovie[]> => {
    try {
        const moviePromises = movieIds.map((id) =>
            axios.get(`${BASE_URL}/movie/${id}`, {
                params: {
                    api_key: TMDB_TOKEN,
                },
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
                id: movie.id.toString(),
                movie_id: movie.id.toString(),
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                backdrop_path: movie.backdrop_path,
                genre_ids: movie.genre_ids,
            }
        })
    } catch (error) {
        console.error("Error fetching movies by IDs:", error)
        throw error
    }
}
