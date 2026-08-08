import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { config } from "@/lib/config"
import { authHeaders } from "@/lib/auth-client"

const API_URL = `${config.api.baseUrl}/api`
interface FriendMovie {
    id: string
    movie_id: string
    title: string
    poster_path: string
    backdrop_path: string
    overview: string
    release_date: string
    friend: string
}

interface FriendMoviesResponse {
    friend: string
    movies: FriendMovie[]
}
export function useFriends() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const getFriends = async ({
        page,
        limit,
    }: {
        page: number
        limit: number
    }) => {
        const response = await axios.get(
            `${API_URL}/friends?page=${page}&limit=${limit}`,
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const sendFriendRequest = async (friendUserName: string) => {
        const response = await axios.post(
            `${API_URL}/friends/request`,
            { friendUserName },
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const respondToFriendRequest = async ({
        requestId,
        action,
    }: {
        requestId: string
        action: "accept" | "reject"
    }) => {
        const response = await axios.post(
            `${API_URL}/friends/respond`,
            { requestId, action },
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const removeFriend = async (friendUserName: string) => {
        const response = await axios.post(
            `${API_URL}/friends/remove`,
            { friendUserName },
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const getPendingRequests = async ({
        page,
        limit,
    }: {
        page: number
        limit: number
    }) => {
        const response = await axios.get(
            `${API_URL}/friends/requests?page=${page}&limit=${limit}`,
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const getFriendData = async (username: string) => {
        const response = await axios.get(
            `${API_URL}/friends/data/${username}`,
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    return {
        useGetFriends: ({ page, limit }: { page: number; limit: number }) =>
            useQuery({
                queryKey: ["friends"],
                queryFn: () => getFriends({ page, limit }),
            }),
        useSendFriendRequest: () =>
            useMutation({
                mutationFn: sendFriendRequest,
                onSuccess: () =>
                    queryClient.invalidateQueries({ queryKey: ["friends"] }),
            }),
        useRespondToFriendRequest: () =>
            useMutation({
                mutationFn: respondToFriendRequest,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["friends"] })
                    queryClient.invalidateQueries({
                        queryKey: ["friendRequests"],
                    })
                },
            }),
        useRemoveFriend: () =>
            useMutation({
                mutationFn: removeFriend,
                onSuccess: () =>
                    queryClient.invalidateQueries({ queryKey: ["friends"] }),
            }),
        useGetPendingRequests: ({
            page,
            limit,
        }: {
            page: number
            limit: number
        }) =>
            useQuery({
                queryKey: ["friendRequests"],
                queryFn: () => getPendingRequests({ page, limit }),
            }),
        useGetFriendData: (username: string) =>
            useQuery({
                queryKey: ["friendData", username],
                queryFn: () => getFriendData(username),
                enabled: !!username && !!user,
            }),
    }
}

const getFriendTopMovies = async (): Promise<FriendMoviesResponse[]> => {
    const response = await axios.get(`${API_URL}/friends/top-movies`, {
        headers: authHeaders(),
    })
    return response.data
}

export function useFriendTopMovies() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["friendTopMovies"],
        queryFn: async () => {
            if (!authHeaders().Authorization) {
                throw new Error("No user token available")
            }
            return getFriendTopMovies()
        },
        enabled: !!user,
    })
}
