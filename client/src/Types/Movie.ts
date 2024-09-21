import { z } from "zod"

export interface TMDBMovie {
    id: string
    title?: string
    poster_path?: string
    release_date?: string
    backdrop_path?: string
    genre_ids?: number[]
}
export interface SimpleMovie {
    movie_id: string
    id: string
    title?: string | undefined
    poster_path?: string | undefined
    release_date: string
    overview?: string
    backdrop_path?: string
    friend?: string
    genre_ids?: number[]
}

export interface Movie {
    id?: string
    title?: string
    poster_path?: string
    release_date?: string
    genre_ids?: number[]
}

export const movieSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    poster_path: z.string().optional(),
    release_date: z.string().optional(),
    genre_ids: z.array(z.number()).optional(),
})
