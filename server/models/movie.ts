import { Schema } from "mongoose"

export interface MovieInList {
    movie_id: string
    title: string
    poster_path: string
    release_date?: string
    genre_ids?: number[]
}

export const movieInListSchema = new Schema<MovieInList>({
    movie_id: { type: String, required: true },
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String },
    genre_ids: [{ type: Number }],
})
