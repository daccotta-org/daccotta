import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"

const API_URL = "http://localhost:8080/api"

export function useFriends() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const getFriends = async () => {
        const idToken = await user?.getIdToken()
        const response = await axios.get(`${API_URL}/friends`, {
            headers: { Authorization: `Bearer ${idToken}` },
        })
        return response.data
    }

    const sendFriendRequest = async (friendId: string) => {
        const idToken = await user?.getIdToken()
        const response = await axios.post(
            `${API_URL}/friends/request`,
            { friendId },
            {
                headers: { Authorization: `Bearer ${idToken}` },
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
        const idToken = await user?.getIdToken()
        const response = await axios.post(
            `${API_URL}/friends/respond`,
            { requestId, action },
            {
                headers: { Authorization: `Bearer ${idToken}` },
            }
        )
        return response.data
    }

    const removeFriend = async (friendId: string) => {
        const idToken = await user?.getIdToken()
        const response = await axios.post(
            `${API_URL}/friends/remove`,
            { friendId },
            {
                headers: { Authorization: `Bearer ${idToken}` },
            }
        )
        return response.data
    }

    const getPendingRequests = async () => {
        const idToken = await user?.getIdToken()
        const response = await axios.get(`${API_URL}/friends/requests`, {
            headers: { Authorization: `Bearer ${idToken}` },
        })
        return response.data
    }

    return {
        useGetFriends: () =>
            useQuery({
                queryKey: ["friends"],
                queryFn: getFriends,
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
        useGetPendingRequests: () =>
            useQuery({
                queryKey: ["friendRequests"],
                queryFn: getPendingRequests,
            }),
    }
}
