import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { config } from "@/lib/config"
import { authHeaders } from "@/lib/auth-client"
import type {
    GroupActivityItem,
    GroupList,
    GroupListMovie,
    GroupRole,
    GroupStats,
    GroupSummary,
} from "@/Types/Group"

const API_URL = `${config.api.baseUrl}/api/group`

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return (
            (error.response?.data as { message?: string })?.message || fallback
        )
    }
    return fallback
}

export function useGroups() {
    const queryClient = useQueryClient()

    const useGetMyGroups = () =>
        useQuery({
            queryKey: ["groups"],
            queryFn: async () => {
                const { data } = await axios.get<{ groups: GroupSummary[] }>(
                    API_URL,
                    { headers: authHeaders() }
                )
                return data.groups
            },
        })

    const useGetGroup = (groupId: string | undefined) =>
        useQuery({
            queryKey: ["group", groupId],
            queryFn: async () => {
                const { data } = await axios.get<{ group: GroupSummary }>(
                    `${API_URL}/${groupId}`,
                    { headers: authHeaders() }
                )
                return data.group
            },
            enabled: !!groupId,
        })

    const useCreateGroup = () =>
        useMutation({
            mutationFn: async (body: {
                name: string
                description?: string
                group_icon?: string
            }) => {
                const { data } = await axios.post<{ group: GroupSummary }>(
                    API_URL,
                    body,
                    { headers: authHeaders() }
                )
                return data.group
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["groups"] })
            },
        })

    const useUpdateGroup = (groupId: string) =>
        useMutation({
            mutationFn: async (body: {
                name?: string
                description?: string
                group_icon?: string
            }) => {
                const { data } = await axios.patch<{ group: GroupSummary }>(
                    `${API_URL}/${groupId}`,
                    body,
                    { headers: authHeaders() }
                )
                return data.group
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["groups"] })
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
            },
        })

    const useDeleteGroup = () =>
        useMutation({
            mutationFn: async (groupId: string) => {
                await axios.delete(`${API_URL}/${groupId}`, {
                    headers: authHeaders(),
                })
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["groups"] })
            },
        })

    const useAddMember = (groupId: string) =>
        useMutation({
            mutationFn: async (username: string) => {
                const { data } = await axios.post<{ group: GroupSummary }>(
                    `${API_URL}/${groupId}/members`,
                    { username },
                    { headers: authHeaders() }
                )
                return data.group
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useRemoveMember = (groupId: string) =>
        useMutation({
            mutationFn: async (userId: string) => {
                await axios.delete(
                    `${API_URL}/${groupId}/members/${userId}`,
                    { headers: authHeaders() }
                )
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
                queryClient.invalidateQueries({ queryKey: ["groups"] })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useUpdateMemberRole = (groupId: string) =>
        useMutation({
            mutationFn: async ({
                userId,
                role,
            }: {
                userId: string
                role: GroupRole
            }) => {
                const { data } = await axios.patch<{ group: GroupSummary }>(
                    `${API_URL}/${groupId}/members/${userId}`,
                    { role },
                    { headers: authHeaders() }
                )
                return data.group
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useGetGroupLists = (groupId: string | undefined) =>
        useQuery({
            queryKey: ["group-lists", groupId],
            queryFn: async () => {
                const { data } = await axios.get<{
                    lists: GroupList[]
                    limits: {
                        max_lists: number
                        max_movies: number
                        list_count: number
                    }
                }>(`${API_URL}/${groupId}/lists`, {
                    headers: authHeaders(),
                })
                return data
            },
            enabled: !!groupId,
        })

    const useCreateGroupList = (groupId: string) =>
        useMutation({
            mutationFn: async (body: {
                name: string
                description?: string
            }) => {
                const { data } = await axios.post<{ list: GroupList }>(
                    `${API_URL}/${groupId}/lists`,
                    body,
                    { headers: authHeaders() }
                )
                return data.list
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["group-lists", groupId],
                })
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useDeleteGroupList = (groupId: string) =>
        useMutation({
            mutationFn: async (listId: string) => {
                await axios.delete(`${API_URL}/${groupId}/lists/${listId}`, {
                    headers: authHeaders(),
                })
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["group-lists", groupId],
                })
                queryClient.invalidateQueries({ queryKey: ["group", groupId] })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useGetGroupList = (
        groupId: string | undefined,
        listId: string | undefined
    ) =>
        useQuery({
            queryKey: ["group-list", groupId, listId],
            queryFn: async () => {
                const { data } = await axios.get<{
                    list: GroupList
                    limits: { max_movies: number; movie_count: number }
                }>(`${API_URL}/${groupId}/lists/${listId}`, {
                    headers: authHeaders(),
                })
                return data
            },
            enabled: !!groupId && !!listId,
        })

    const useAddMovie = (groupId: string, listId: string) =>
        useMutation({
            mutationFn: async (movie: GroupListMovie) => {
                const { data } = await axios.post<{ list: GroupList }>(
                    `${API_URL}/${groupId}/lists/${listId}/movies`,
                    movie,
                    { headers: authHeaders() }
                )
                return data.list
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["group-list", groupId, listId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["group-lists", groupId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useRemoveMovie = (groupId: string, listId: string) =>
        useMutation({
            mutationFn: async (movieId: string) => {
                const { data } = await axios.delete<{ list: GroupList }>(
                    `${API_URL}/${groupId}/lists/${listId}/movies/${movieId}`,
                    { headers: authHeaders() }
                )
                return data.list
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["group-list", groupId, listId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["group-lists", groupId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["group-activity", groupId],
                })
            },
        })

    const useGetActivity = (groupId: string | undefined) =>
        useQuery({
            queryKey: ["group-activity", groupId],
            queryFn: async () => {
                const { data } = await axios.get<{
                    activity: GroupActivityItem[]
                }>(`${API_URL}/${groupId}/activity?page=1&limit=20`, {
                    headers: authHeaders(),
                })
                return data.activity
            },
            enabled: !!groupId,
        })

    const useGetStats = (groupId: string | undefined) =>
        useQuery({
            queryKey: ["group-stats", groupId],
            queryFn: async () => {
                const { data } = await axios.get<{
                    stats: GroupStats
                    perMember: {
                        user_id: string
                        userName: string
                        watched: number
                    }[]
                    entryCount: number
                }>(`${API_URL}/${groupId}/stats`, {
                    headers: authHeaders(),
                })
                return data
            },
            enabled: !!groupId,
        })

    const useGetRecommendations = (groupId: string | undefined) =>
        useQuery({
            queryKey: ["group-recommendations", groupId],
            queryFn: async () => {
                const { data } = await axios.get<{
                    topGenres: { id: number; name: string; count: number }[]
                    commonWatches: (GroupListMovie & {
                        watcher_count: number
                    })[]
                    memberFavorites: (GroupListMovie & {
                        watcher_count: number
                    })[]
                    discover: GroupListMovie[]
                    seeds: { genreId: number | null; year: number }
                }>(`${API_URL}/${groupId}/recommendations`, {
                    headers: authHeaders(),
                })
                return data
            },
            enabled: !!groupId,
        })

    return {
        useGetMyGroups,
        useGetGroup,
        useCreateGroup,
        useUpdateGroup,
        useDeleteGroup,
        useAddMember,
        useRemoveMember,
        useUpdateMemberRole,
        useGetGroupLists,
        useCreateGroupList,
        useDeleteGroupList,
        useGetGroupList,
        useAddMovie,
        useRemoveMovie,
        useGetActivity,
        useGetStats,
        useGetRecommendations,
        getErrorMessage,
    }
}
