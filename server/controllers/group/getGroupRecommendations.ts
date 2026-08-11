import type { Request, Response } from "express"
import axios from "axios"
import User from "../../models/User"
import { assertGroupMember } from "../../utils/groupPermissions"
import {
    genreMap,
    handleError,
    loadGroup,
    param,
} from "./helpers"

export const getGroupRecommendations = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        const members = await User.find({
            _id: { $in: group.members.map((m) => m.user_id) },
        }).select("userName journal")

        const genreCount: Record<number, number> = {}
        const movieWatchers = new Map<
            string,
            { movie: (typeof members)[0]["journal"][0]["movie"]; count: number }
        >()

        members.forEach((m) => {
            const seen = new Set<string>()
            ;(m.journal || []).forEach((j) => {
                ;(j.movie.genre_ids || []).forEach((gid) => {
                    genreCount[gid] = (genreCount[gid] || 0) + 1
                })
                if (!seen.has(j.movie.movie_id)) {
                    seen.add(j.movie.movie_id)
                    const existing = movieWatchers.get(j.movie.movie_id)
                    if (existing) {
                        existing.count += 1
                    } else {
                        movieWatchers.set(j.movie.movie_id, {
                            movie: j.movie,
                            count: 1,
                        })
                    }
                }
            })
        })

        const topGenreIds = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id]) => Number(id))

        const commonWatches = [...movieWatchers.values()]
            .filter((m) => m.count >= 2)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((m) => ({ ...m.movie, watcher_count: m.count }))

        // Movies one member loved that others haven't logged
        const suggestionsFromJournals: typeof commonWatches = []
        const allWatched = new Set(movieWatchers.keys())
        for (const m of members) {
            for (const j of m.journal || []) {
                const watchers = movieWatchers.get(j.movie.movie_id)?.count ?? 0
                if (
                    watchers === 1 &&
                    (j.rating ?? 0) >= 4 &&
                    !suggestionsFromJournals.some(
                        (s) => s.movie_id === j.movie.movie_id
                    )
                ) {
                    suggestionsFromJournals.push({
                        ...j.movie,
                        watcher_count: 1,
                    })
                }
                if (suggestionsFromJournals.length >= 12) break
            }
            if (suggestionsFromJournals.length >= 12) break
        }

        let discover: Array<{
            movie_id: string
            title: string
            poster_path: string
            release_date?: string
            genre_ids?: number[]
        }> = []

        const tmdbToken = process.env.TMDB_ACCESS_TOKEN
        if (tmdbToken && topGenreIds[0]) {
            try {
                const year = new Date().getFullYear() - 1
                const { data } = await axios.get(
                    "https://api.themoviedb.org/3/discover/movie",
                    {
                        params: {
                            with_genres: topGenreIds[0],
                            primary_release_year: year,
                            language: "en-US",
                            sort_by: "popularity.desc",
                            page: 1,
                        },
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${tmdbToken}`,
                        },
                    }
                )
                discover = (data.results || [])
                    .filter(
                        (movie: { id: number }) =>
                            !allWatched.has(String(movie.id))
                    )
                    .slice(0, 12)
                    .map(
                        (movie: {
                            id: number
                            title: string
                            poster_path: string
                            release_date: string
                            genre_ids: number[]
                        }) => ({
                            movie_id: String(movie.id),
                            title: movie.title,
                            poster_path: movie.poster_path,
                            release_date: movie.release_date,
                            genre_ids: movie.genre_ids,
                        })
                    )
            } catch (err) {
                console.error("TMDB discover failed:", err)
            }
        }

        res.json({
            topGenres: topGenreIds.map((id) => ({
                id,
                name: genreMap[id] || `Genre ${id}`,
                count: genreCount[id],
            })),
            commonWatches,
            memberFavorites: suggestionsFromJournals,
            discover,
            seeds: {
                genreId: topGenreIds[0] ?? null,
                year: new Date().getFullYear() - 1,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}
