import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { SimpleMovie } from "@/Types/Movie"
import { config } from "@/lib/config"
import { authHeaders } from "@/lib/auth-client"

const API_URL = `${config.api.baseUrl}/api`

interface Journal {
    _id: string
    movie: SimpleMovie
    dateWatched: Date
    rewatches: number
    rating: number
}

export function useJournal() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const fetchJournalEntries = async (): Promise<Journal[]> => {
        const response = await axios.get(`${API_URL}/journal/entries`, {
            headers: authHeaders(),
        })
        return response.data.journalEntries
    }
    const fetchFriendJournalEntries = async (
        userName: string
    ): Promise<Journal[]> => {
        const response = await axios.get(
            `${API_URL}/journal/entries/${userName}`,
            {
                headers: authHeaders(),
            }
        )
        return response.data.journalEntries
    }

    const addJournalEntry = async (entry: Omit<Journal, "_id">) => {
        const response = await axios.post(`${API_URL}/journal/add`, entry, {
            headers: authHeaders(),
        })
        return response.data
    }

    const searchMovie = async (query: string): Promise<SimpleMovie[]> => {
        const response = await axios.get(`${API_URL}/movies/search`, {
            params: { query },
            headers: authHeaders(),
        })
        return response.data.results
    }

    const deleteJournalEntry = async (entryId: string) => {
        const response = await axios.delete(
            `${API_URL}/journal/delete/${entryId}`,
            {
                headers: authHeaders(),
            }
        )
        return response.data
    }

    const editJournalEntry = async (entry: Omit<Journal, "_id">) => {
        const response = await axios.post(`${API_URL}/journal/edit`, entry, {
            headers: authHeaders(),
        })
        return response.data
    }

    return {
        useGetJournalEntries: () =>
            useQuery({
                queryKey: ["journalEntries"],
                queryFn: () => fetchJournalEntries(),
                enabled: !!user,
            }),
        useGetFriendJournalEntries: (userName: string) =>
            useQuery({
                queryKey: ["friendjournalEntries"],
                queryFn: () => fetchFriendJournalEntries(userName),
                enabled: !!user,
            }),
        useAddJournalEntry: () =>
            useMutation({
                mutationFn: addJournalEntry,
                onSuccess: () =>
                    queryClient.invalidateQueries({
                        queryKey: ["journalEntries"],
                    }),
            }),
        useSearchMovie: () =>
            useMutation({
                mutationFn: searchMovie,
            }),
        useDeleteJournalEntry: () =>
            useMutation({
                mutationFn: deleteJournalEntry,
                onSuccess: () =>
                    queryClient.invalidateQueries({
                        queryKey: ["journalEntries"],
                    }),
            }),
        useEditJournalEntry: () =>
            useMutation({
                mutationFn: editJournalEntry,
                onSuccess: () =>
                    queryClient.invalidateQueries({
                        queryKey: ["journalEntries"],
                    }),
            }),
    }
}
