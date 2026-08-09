import type { LucideIcon } from "lucide-react"

export type GroupRole = "admin" | "member"

export type GroupMember = {
    user_id: string
    role: GroupRole
    joined_at: string
    userName?: string
    profile_image?: string
}

export type GroupSummary = {
    id: string
    name: string
    description: string
    group_icon: string
    list_ids: string[]
    created_by: string
    created_at: string
    members: GroupMember[]
    member_count: number
    list_count: number
}

export type GroupListMovie = {
    movie_id: string
    title: string
    poster_path: string
    release_date?: string
    genre_ids?: number[]
}

export type GroupList = {
    list_id: string
    name: string
    description?: string
    list_type: "group"
    group_id: string
    movies: GroupListMovie[]
    date_created: string
    isPublic: boolean
}

export type GroupActivityItem = {
    id: string
    action: string
    meta: {
        list_id?: string
        list_name?: string
        movie_id?: string
        movie_title?: string
        target_user_id?: string
        target_username?: string
        role?: GroupRole
    }
    created_at: string
    actor: {
        user_id: string
        userName: string
        profile_image: string
    }
}

export type GroupStats = {
    totalWatched: number
    monthlyWatched: { month: string; count: number }[]
    topGenres: { genre: string; count: number }[]
    genreDistribution: { genre: string; count: number }[]
    topDecade: { decade: string; count: number }
}

/** Legacy stub type used by unused demo components */
export type IGroup = {
    id: string
    description?: string
    icon?: LucideIcon
    name?: string
    members?: GroupMember[]
}
