import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { getIdToken } from "firebase/auth"
import { SimpleMovie } from "@/Types/Movie"

const API_URL = "http://localhost:8080/api"

interface Journal {
    _id: string
    movie: SimpleMovie
    dateWatched: Date
    rewatches: number
}

export function useJournal() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const getIdTokenFromUser = async () => {
        if (!user) throw new Error("No user logged in")
        return await getIdToken(user)
    }

    const fetchJournalEntries = async (): Promise<Journal[]> => {
        const idToken = await getIdTokenFromUser()
        const response = await axios.get(`${API_URL}/journal/entries`, {
            headers: { Authorization: `Bearer ${idToken}` },
        })
        return response.data.journalEntries
    }
    const fetchFriendJournalEntries = async (
        userName: string
    ): Promise<Journal[]> => {
        const idToken = await getIdTokenFromUser()
        const response = await axios.get(
            `${API_URL}/journal/entries/${userName}`,
            {
                headers: { Authorization: `Bearer ${idToken}` },
            }
        )
        return response.data.journalEntries
    }

    const addJournalEntry = async (entry: Omit<Journal, "_id">) => {
        const idToken = await getIdTokenFromUser()
        const response = await axios.post(`${API_URL}/journal/add`, entry, {
            headers: { Authorization: `Bearer ${idToken}` },
        })
        return response.data
    }

    const searchMovie = async (query: string): Promise<SimpleMovie[]> => {
        const idToken = await getIdTokenFromUser()
        const response = await axios.get(`${API_URL}/movies/search`, {
            params: { query },
            headers: { Authorization: `Bearer ${idToken}` },
        })
        return response.data.results
    }

    const deleteJournalEntry = async (entryId: string) => {
        const idToken = await getIdTokenFromUser()
        const response = await axios.delete(
            `${API_URL}/journal/delete/${entryId}`,
            {
                headers: { Authorization: `Bearer ${idToken}` },
            }
        )
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
    }
}
