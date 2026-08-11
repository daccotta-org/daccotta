import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { IUser } from "../Types/User"
import { SignUpFormData } from "../Types/validationSchema"
import { SimpleMovie } from "@/Types/Movie"
import { config } from "@/lib/config"
import { authClient, authHeaders } from "@/lib/auth-client"

interface CreateListData {
    name: string
    description: string
    isPublic: boolean
    list_type: "user" | "group"
}

const api = axios.create({
    baseURL: config.api.baseUrl,
})

function jsonAuthHeaders() {
    return {
        "Content-Type": "application/json",
        ...authHeaders(),
    }
}

export const createList = async (userId: string, data: CreateListData) => {
    try {
        const response = await api.post(
            `/api/list/create`,
            {
                ...data,
                movies: [],
                members: [{ user_id: userId, is_author: true }],
            },
            {
                headers: jsonAuthHeaders(),
            }
        )
        return response.data
    } catch (error) {
        console.error("Error creating list:", error)
        throw new Error("Failed to create list")
    }
}

export const deleteList = async (listId: string) => {
    try {
        const response = await api.delete(`/api/list/${listId}/remove-list`, {
            headers: jsonAuthHeaders(),
        })
        return response.data
    } catch (error) {
        console.error("Error deleting list:", error)
        throw new Error("Failed to delete list")
    }
}

export function useSignUp() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (data: SignUpFormData) => createUser(data),
        onSuccess: () => {
            navigate("/")
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error("onError", error?.response)
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.error("onSettled error", error)
            } else {
                await queryClient.invalidateQueries({ queryKey: ["users"] })
            }
        },
    })
}

export const createUser = async (data: SignUpFormData) => {
    const signUpResult = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
    })

    if (signUpResult.error) {
        throw new Error(signUpResult.error.message || "Failed to sign up")
    }

    const sessionUser = signUpResult.data?.user
    if (!sessionUser) {
        throw new Error("Sign up succeeded but no user returned")
    }

    const response = await api.post(
        "/api/user/",
        {
            username: data.username,
            email: data.email,
            onboarded: false,
        },
        {
            headers: authHeaders(),
        }
    )

    window.location.href = "/onboard"
    return response
}

// TODO: enable when Google OAuth is configured — authClient.signIn.social({ provider: "google" })
export const createUserWithGoogle = async (_email: string, _username: string) => {
    throw new Error(
        "Google sign-up is not enabled yet. See TODO in server/lib/auth.ts"
    )
}

export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await api.post("/api/user/check-email", { email })
        return response.data.exists
    } catch {
        throw new Error("Failed to check Email")
    }
}

export const updateUserProfile = async (
    userId: string,
    data: Partial<IUser>
): Promise<IUser> => {
    try {
        const response = await api.post(
            `/api/user/${userId}/complete-onboarding`,
            data,
            {
                headers: jsonAuthHeaders(),
            }
        )

        const updatedUser = response.data.user

        if (data.onboarded !== undefined) {
            localStorage.setItem("onboarded", updatedUser.onboarded.toString())
        }

        return updatedUser
    } catch {
        throw new Error("Failed to update user profile")
    }
}

export const checkOnboardedStatus = async (
    userId: string
): Promise<boolean> => {
    try {
        const response = await api.get(`/api/user/${userId}/onboarded`, {
            headers: jsonAuthHeaders(),
        })

        return response.data.onboarded
    } catch {
        throw new Error("Failed to check onboarded status")
    }
}

export const searchUsers = async (
    searchTerm: string,
    uid: string | undefined
) => {
    try {
        if (!uid) {
            throw new Error("User not authenticated")
        }

        const response = await api.get(
            `/api/user/${uid}/search?term=${searchTerm}`,
            {
                headers: jsonAuthHeaders(),
            }
        )
        return response.data
    } catch (error) {
        console.error("Error searching users:", error)
        throw new Error("Failed to search users")
    }
}

export const useSearchUsers = (searchTerm: string, uid: string | undefined) =>
    useQuery({
        queryKey: ["users", searchTerm],
        queryFn: () => searchUsers(searchTerm, uid),
        enabled: searchTerm.length > 2,
    })

export const checkUsernameAvailability = async (
    username: string
): Promise<boolean> => {
    try {
        const response = await api.get(`/api/user/check-username/${username}`, {
            headers: jsonAuthHeaders(),
        })

        return response.data.isAvailable
    } catch (error) {
        console.error("Error checking username availability:", error)
        throw new Error("Failed to check username availability")
    }
}

export const getUserData = async (uid?: string) => {
    const response = await api.get(`/api/user/${uid}`, {
        headers: jsonAuthHeaders(),
    })
    return response.data
}

export const getUserData_page = async (uid?: string) => {
    const response = await api.get(`/api/user/${uid}/other`, {
        headers: jsonAuthHeaders(),
    })
    return response.data
}

export const fetchMovieToList = async (
    uid: string,
    page: number,
    limit: number
) => {
    const response = await api.get(
        `/api/list/${uid}?page=${page}&limit=${limit}`,
        {
            headers: jsonAuthHeaders(),
        }
    )
    return response.data
}

export const getListById = async (listId: string) => {
    const response = await api.get(`/api/list/id/${listId}`, {
        headers: jsonAuthHeaders(),
    })
    return response.data as {
        list: {
            list_id: string
            name: string
            movies: SimpleMovie[]
            description?: string
        }
        ownerUserName: string | null
        isOwner: boolean
    }
}

export const addMovieToList = async (listId: string, movie: SimpleMovie) => {
    const response = await api.post(
        `/api/list/${listId}/add-movie-in-list`,
        {
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
        },
        {
            headers: jsonAuthHeaders(),
        }
    )
    return response.data
}

export const removeMovieFromList = async (listId: string, movieId: string) => {
    const response = await api.delete(`/api/list/${listId}/remove-movie`, {
        headers: jsonAuthHeaders(),
        data: { movie_id: movieId },
    })
    return response.data
}

export const updateProfileImage = async (
    userId: string,
    profileImage: string
) => {
    try {
        const response = await api.put(
            `/api/user/${userId}/update-profile-image`,
            {
                profileImage,
            },
            {
                headers: jsonAuthHeaders(),
            }
        )
        return response.data
    } catch (error) {
        console.error("Error updating profile image:", error)
        throw new Error("Failed to update profile image")
    }
}
