import type { Response } from "express"
import mongoose from "mongoose"
import Group from "../../models/Group"
import GroupActivity, {
    type GroupActivityAction,
} from "../../models/GroupActivity"
import User from "../../models/User"
import { GroupPermissionError } from "../../utils/groupPermissions"

export function param(value: string | string[]): string {
    return Array.isArray(value) ? value[0] : value
}

export const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
}

export function handleError(res: Response, error: unknown) {
    if (error instanceof GroupPermissionError) {
        return res.status(error.status).json({ message: error.message })
    }
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
}

export async function loadGroup(groupId: string) {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return null
    }
    return Group.findById(groupId)
}

export async function logActivity(input: {
    group_id: string
    actor_id: string
    action: GroupActivityAction
    meta?: Record<string, unknown>
}) {
    await GroupActivity.create({
        group_id: input.group_id,
        actor_id: input.actor_id,
        action: input.action,
        meta: input.meta ?? {},
    })
}

export async function enrichMembers(userIds: string[]) {
    const users = await User.find({ _id: { $in: userIds } }).select(
        "_id userName profile_image"
    )
    const byId = new Map(users.map((u) => [u._id, u]))
    return userIds.map((id) => {
        const u = byId.get(id)
        return {
            user_id: id,
            userName: u?.userName ?? "Unknown",
            profile_image: u?.profile_image ?? "",
        }
    })
}

export function serializeGroup(
    group: InstanceType<typeof Group>,
    memberProfiles?: Awaited<ReturnType<typeof enrichMembers>>
) {
    const profileMap = new Map(
        (memberProfiles ?? []).map((p) => [p.user_id, p])
    )
    return {
        id: group._id.toString(),
        name: group.name,
        description: group.description ?? "",
        group_icon: group.group_icon ?? "",
        list_ids: group.list_ids,
        created_by: group.created_by,
        created_at: group.created_at,
        members: group.members.map((m) => ({
            user_id: m.user_id,
            role: m.role,
            joined_at: m.joined_at,
            userName: profileMap.get(m.user_id)?.userName,
            profile_image: profileMap.get(m.user_id)?.profile_image,
        })),
        member_count: group.members.length,
        list_count: group.list_ids.length,
    }
}

export function calculateStatsFromEntries(
    entries: {
        movie: { genre_ids?: number[]; release_date?: string }
        dateWatched: Date
    }[]
) {
    const totalWatched = entries.length
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    const monthlyCount: Record<number, number> = {}
    for (let i = 0; i < 12; i++) monthlyCount[i] = 0
    entries.forEach((e) => {
        const d = new Date(e.dateWatched)
        monthlyCount[d.getMonth()] = (monthlyCount[d.getMonth()] || 0) + 1
    })
    const monthlyWatched = monthNames.map((month, index) => ({
        month,
        count: monthlyCount[index] || 0,
    }))

    const genreCount: Record<string, number> = {}
    entries.forEach((e) => {
        ;(e.movie.genre_ids || []).forEach((id) => {
            const name = genreMap[id] || `Genre ${id}`
            genreCount[name] = (genreCount[name] || 0) + 1
        })
    })
    const genreEntries = Object.entries(genreCount)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
    const topGenres = genreEntries.slice(0, 5)
    const genreDistribution = genreEntries

    const decadeCount: Record<string, number> = {}
    entries.forEach((e) => {
        const year = e.movie.release_date
            ? parseInt(e.movie.release_date.slice(0, 4), 10)
            : NaN
        if (!Number.isNaN(year)) {
            const decade = `${Math.floor(year / 10) * 10}s`
            decadeCount[decade] = (decadeCount[decade] || 0) + 1
        }
    })
    const topDecadeEntry = Object.entries(decadeCount).sort(
        (a, b) => b[1] - a[1]
    )[0]
    const topDecade = topDecadeEntry
        ? { decade: topDecadeEntry[0], count: topDecadeEntry[1] }
        : { decade: "unknown", count: 0 }

    return {
        totalWatched,
        monthlyWatched,
        topGenres,
        genreDistribution,
        topDecade,
    }
}
