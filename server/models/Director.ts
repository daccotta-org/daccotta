import mongoose from "mongoose"
import { Schema, model, Document } from "mongoose"
import Person, { personSchema } from "./Person"

export interface Directors extends Document {
    directors_id: string
    names: Person[]
}

export const directorSchema = new Schema<Directors>({
    directors_id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    names: [personSchema],
})

const Director = model<Directors>("Director", directorSchema)

export default Director
