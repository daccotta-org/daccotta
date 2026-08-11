import { z } from "zod"

export const MAX_GROUP_LISTS = 15
export const MAX_LIST_MOVIES = 100

export const createGroupSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(80),
    description: z.string().trim().max(500).optional(),
    group_icon: z.string().trim().max(500).optional(),
})

export const updateGroupSchema = z
    .object({
        name: z.string().trim().min(1).max(80).optional(),
        description: z.string().trim().max(500).optional(),
        group_icon: z.string().trim().max(500).optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.description !== undefined ||
            data.group_icon !== undefined,
        { message: "At least one field is required" }
    )

export const addMemberSchema = z.object({
    username: z.string().trim().min(1, "Username is required").max(50),
})

export const updateMemberRoleSchema = z.object({
    role: z.enum(["admin", "member"]),
})

export const createGroupListSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(80),
    description: z.string().trim().max(500).optional(),
})

export const addMovieSchema = z.object({
    movie_id: z.string().trim().min(1),
    title: z.string().trim().min(1).max(300),
    poster_path: z.string().trim().optional().default(""),
    release_date: z.string().trim().optional(),
    genre_ids: z.array(z.number().int()).optional(),
})

export const groupIdParams = z.object({
    groupId: z.string().trim().min(1),
})

export const groupListParams = z.object({
    groupId: z.string().trim().min(1),
    listId: z.string().trim().min(1),
})

export const groupListMovieParams = z.object({
    groupId: z.string().trim().min(1),
    listId: z.string().trim().min(1),
    movieId: z.string().trim().min(1),
})

export const groupMemberParams = z.object({
    groupId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
})

export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
})
