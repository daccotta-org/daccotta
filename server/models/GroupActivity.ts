import mongoose, { Schema, model, type Document } from "mongoose"

export type GroupActivityAction =
    | "movie_added"
    | "movie_removed"
    | "member_added"
    | "member_removed"
    | "list_created"
    | "list_deleted"
    | "role_changed"

export interface GroupActivityMeta {
    list_id?: string
    list_name?: string
    movie_id?: string
    movie_title?: string
    target_user_id?: string
    target_username?: string
    role?: "admin" | "member"
}

export interface GroupActivityDoc extends Document {
    group_id: string
    actor_id: string
    action: GroupActivityAction
    meta: GroupActivityMeta
    created_at: Date
}

const groupActivitySchema = new Schema<GroupActivityDoc>({
    group_id: { type: String, required: true, index: true },
    actor_id: { type: String, required: true },
    action: {
        type: String,
        enum: [
            "movie_added",
            "movie_removed",
            "member_added",
            "member_removed",
            "list_created",
            "list_deleted",
            "role_changed",
        ],
        required: true,
    },
    meta: {
        list_id: String,
        list_name: String,
        movie_id: String,
        movie_title: String,
        target_user_id: String,
        target_username: String,
        role: { type: String, enum: ["admin", "member"] },
    },
    created_at: { type: Date, default: Date.now },
})

groupActivitySchema.index({ group_id: 1, created_at: -1 })

const GroupActivity = model<GroupActivityDoc>(
    "GroupActivity",
    groupActivitySchema
)

export default GroupActivity
