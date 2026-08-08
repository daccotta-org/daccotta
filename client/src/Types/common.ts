import { SimpleMovie } from "@/Types/Movie"

// Common List interface used across components
export interface List {
    list_id: string
    name: string
    movies: SimpleMovie[]
    description?: string
    likes?: number
    comments?: number
    averageRating?: number
    is_public?: boolean
    list_type?: "user" | "group"
}

// User data interface
export interface UserData {
    uid?: string
    userName: string
    username?: string
    email: string
    age?: number
    badges?: string[]
    groups?: string[]
    lists: List[]
    profileImage?: string
    onboarded?: boolean
}

// Movie in list interface for when movies only have basic info
export interface MovieInList {
    movie_id: string
    id: string
    title?: string
    poster_path?: string
}

// Journal entry interface
export interface JournalEntry {
    _id: string
    movie: SimpleMovie
    dateWatched: Date
    rewatches: number
    rating?: number
    review?: string
}

// API Response wrapper
export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

// Pagination interface
export interface PaginationInfo {
    page: number
    limit: number
    totalPages: number
    totalItems?: number
}

// Loading state interface
export interface LoadingState {
    isLoading: boolean
    error: string | null
}
