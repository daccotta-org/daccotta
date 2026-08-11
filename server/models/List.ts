import mongoose, { Schema, type Document } from "mongoose"
import { movieInListSchema, type MovieInList } from "./movie"

export interface List extends Document {
    list_id: string
    name: string
    list_type: "user" | "group"
    group_id?: string
    movies: MovieInList[]
    members: {
        user_id: string
        is_author: boolean
    }[]
    date_created: Date
    description: string
    isPublic: boolean
}

const listSchema = new Schema<List>({
    list_id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: { type: String, required: true },
    list_type: {
        type: String,
        enum: ["user", "group"],
        required: true,
    },
    group_id: { type: String, index: true },
    movies: [movieInListSchema],
    members: [
        {
            user_id: { type: String, required: true },
            is_author: { type: Boolean, required: true },
        },
    ],
    date_created: { type: Date, default: Date.now },
    description: { type: String, required: false },
    isPublic: { type: Boolean, required: true },
})

const ListModel = mongoose.model<List>("List", listSchema)

export default ListModel
