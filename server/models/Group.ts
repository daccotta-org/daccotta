import mongoose, { Schema, model, type Document } from "mongoose"

export type GroupRole = "admin" | "member"

export interface GroupMember {
    user_id: string
    role: GroupRole
    joined_at: Date
}

export interface GroupDoc extends Document {
    name: string
    description?: string
    group_icon?: string
    members: GroupMember[]
    list_ids: string[]
    created_by: string
    created_at: Date
}

const groupMemberSchema = new Schema<GroupMember>(
    {
        user_id: { type: String, required: true },
        role: { type: String, enum: ["admin", "member"], required: true },
        joined_at: { type: Date, default: Date.now },
    },
    { _id: false }
)

const groupSchema = new Schema<GroupDoc>({
    name: { type: String, required: true },
    description: { type: String },
    group_icon: { type: String },
    members: { type: [groupMemberSchema], default: [] },
    list_ids: { type: [String], default: [] },
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
})

groupSchema.index({ "members.user_id": 1 })

const Group = model<GroupDoc>("Group", groupSchema)

export default Group
