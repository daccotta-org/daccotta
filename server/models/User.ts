// import mongoose, { Schema, model, Document } from "mongoose"
// import { movieInListSchema, type MovieInList } from "./movie"
// // import { type List } from "./List";  // Import both the model and the interface
// // import listSchema from "./List";
// import Person from "./Person"
// import { directorSchema, type Directors } from "./Director"

// export interface List extends Document {
//     list_id: string
//     name: string
//     list_type: "user" | "group"
//     movies: MovieInList[]
//     members: {
//         user_id: string
//         is_author: boolean
//     }[]
//     date_created: Date
//     description: string
//     isPublic: boolean
// }

// const listSchema = new Schema<List>({
//     list_id: {
//         type: String,
//         required: true,
//         unique: true,
//         default: () => new mongoose.Types.ObjectId().toString(),
//     },
//     name: { type: String, required: true },
//     list_type: {
//         type: String,
//         enum: ["user", "group"],
//         required: true,
//     },
//     movies: [movieInListSchema],
//     members: [
//         {
//             user_id: { type: String, required: true },
//             is_author: { type: Boolean, required: true },
//         },
//     ],
//     date_created: { type: Date, default: Date.now },
//     description: { type: String, required: false },
//     isPublic: { type: Boolean, required: true },
// })

// export interface FriendRequest {
//     _id?: mongoose.Types.ObjectId
//     from: string // Changed to string (username)
//     to: string // Changed to string (username)
//     status: "pending" | "accepted" | "rejected"
//     createdAt: Date
// }

// interface Users extends Document {
//     _id: string
//     userName: string
//     age: number
//     email: string
//     groups: Schema.Types.ObjectId[]
//     badges: Schema.Types.ObjectId[]
//     lists: List[]
//     actor: Schema.Types.ObjectId[]
//     // directors: Person[]
//     directorsold: Directors[]
//     profile_image: string
//     onboarded: boolean
//     friends: string[] // Changed to string[] (usernames)
//     friendRequests: FriendRequest[]
// }

// const friendRequestSchema = new Schema<FriendRequest>({
//     _id: { type: Schema.Types.ObjectId, auto: true },
//     from: { type: String, required: true }, // Changed to String
//     to: { type: String, required: true }, // Changed to String
//     status: {
//         type: String,
//         enum: ["pending", "accepted", "rejected"],
//         default: "pending",
//     },
//     createdAt: { type: Date, default: Date.now },
// })

// const userSchema = new Schema<Users>({
//     _id: {
//         type: String,
//         required: true,
//         default: () => new mongoose.Types.ObjectId().toString(),
//     },
//     userName: { type: String, required: true, unique: true },
//     email: { type: String, required: true },
//     age: { type: Number },
//     groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
//     badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
//     lists: [listSchema], // Reference List model
//     actor: [{ type: Schema.Types.ObjectId, ref: "Person" }],
//     directorsold: [directorSchema],
//     profile_image: { type: String },
//     onboarded: { type: Boolean, default: false },
//     friends: [{ type: String }], // Changed to String
//     friendRequests: [friendRequestSchema],
// })

// const User = model<Users>("User", userSchema)

// export default User

import mongoose, { Schema, model, Document } from "mongoose"
import { movieInListSchema, type MovieInList } from "./movie"
import Person from "./Person"
import { directorSchema, type Directors } from "./Director"

export interface Journal {
    _id: mongoose.Types.ObjectId
    movie: MovieInList
    dateWatched: Date
    rewatches: number
}

export interface List extends Document {
    list_id: string
    name: string
    list_type: "user" | "group"
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

export interface FriendRequest {
    _id?: mongoose.Types.ObjectId
    from: string
    to: string
    status: "pending" | "accepted" | "rejected"
    createdAt: Date
}

export interface Group {
    name: string
    members: string[]
    admin: string
    lists: List[]
}

interface Users extends Document {
    _id: string
    userName: string
    age: number
    email: string
    groups: Group[]
    badges: string[]
    lists: List[]
    actor: Schema.Types.ObjectId[]
    directorsold: Directors[]
    profile_image: string
    onboarded: boolean
    friends: string[]
    friendRequests: FriendRequest[]
    journal: Journal[]
}

const journalSchema = new Schema<Journal>({
    movie: movieInListSchema,
    dateWatched: { type: Date, required: true },
    rewatches: { type: Number, default: 1 },
})

const friendRequestSchema = new Schema<FriendRequest>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
})

const groupSchema = new Schema<Group>({
    name: { type: String, required: true },
    members: [{ type: String, required: true }],
    admin: { type: String, required: true },
    lists: [listSchema],
})

const userSchema = new Schema<Users>({
    _id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    age: { type: Number },
    groups: [groupSchema],
    badges: [{ type: String }],
    lists: [listSchema],
    actor: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    directorsold: [directorSchema],
    profile_image: { type: String },
    onboarded: { type: Boolean, default: false },
    friends: [{ type: String }],
    friendRequests: [friendRequestSchema],
    journal: [journalSchema],
})

const User = model<Users>("User", userSchema)

export default User
