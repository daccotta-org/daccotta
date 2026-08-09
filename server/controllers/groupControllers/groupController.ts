import type { Request, Response } from "express"
import mongoose from "mongoose"
import axios from "axios"
import Group from "../../models/Group"
import GroupActivity, {
    type GroupActivityAction,
} from "../../models/GroupActivity"
import ListModel from "../../models/List"
import User from "../../models/User"
import {
    assertGroupAdmin,
    assertGroupMember,
    canChangeRole,
    findMember,
    GroupPermissionError,
    isLastAdmin,
} from "../../utils/groupPermissions"
import {
    MAX_GROUP_LISTS,
    MAX_LIST_MOVIES,
} from "../../validation/groupSchemas"

function param(value: string | string[]): string {
    return Array.isArray(value) ? value[0] : value
}

const genreMap: Record<number, string> = {
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

function handleError(res: Response, error: unknown) {
    if (error instanceof GroupPermissionError) {
        return res.status(error.status).json({ message: error.message })
    }
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
}

async function loadGroup(groupId: string) {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return null
    }
    return Group.findById(groupId)
}

async function logActivity(input: {
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

async function enrichMembers(userIds: string[]) {
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

function serializeGroup(
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

export const getMyGroups = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groups = await Group.find({ "members.user_id": uid }).sort({
            created_at: -1,
        })
        const allMemberIds = [
            ...new Set(groups.flatMap((g) => g.members.map((m) => m.user_id))),
        ]
        const profiles = await enrichMembers(allMemberIds)
        res.json({
            groups: groups.map((g) => serializeGroup(g, profiles)),
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const createGroup = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const { name, description, group_icon } = req.body

        const group = await Group.create({
            name,
            description,
            group_icon,
            created_by: uid,
            members: [{ user_id: uid, role: "admin", joined_at: new Date() }],
            list_ids: [],
        })

        await User.findByIdAndUpdate(uid, {
            $addToSet: { groupIds: group._id.toString() },
        })

        const profiles = await enrichMembers([uid])
        res.status(201).json({ group: serializeGroup(group, profiles) })
    } catch (error) {
        handleError(res, error)
    }
}

export const getGroup = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)
        const profiles = await enrichMembers(group.members.map((m) => m.user_id))
        res.json({ group: serializeGroup(group, profiles) })
    } catch (error) {
        handleError(res, error)
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupAdmin(group, uid)

        if (req.body.name !== undefined) group.name = req.body.name
        if (req.body.description !== undefined)
            group.description = req.body.description
        if (req.body.group_icon !== undefined)
            group.group_icon = req.body.group_icon

        await group.save()
        const profiles = await enrichMembers(group.members.map((m) => m.user_id))
        res.json({ group: serializeGroup(group, profiles) })
    } catch (error) {
        handleError(res, error)
    }
}

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupAdmin(group, uid)

        const groupId = group._id.toString()
        const memberIds = group.members.map((m) => m.user_id)

        await ListModel.deleteMany({
            list_id: { $in: group.list_ids },
            list_type: "group",
        })
        await GroupActivity.deleteMany({ group_id: groupId })
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $pull: { groupIds: groupId } }
        )
        await group.deleteOne()

        res.json({ message: "Group deleted" })
    } catch (error) {
        handleError(res, error)
    }
}

export const addMember = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const { username } = req.body
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupAdmin(group, uid)

        const adminUser = await User.findById(uid)
        if (!adminUser) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!adminUser.friends.includes(username)) {
            return res.status(400).json({
                message: "You can only add friends to the group",
            })
        }

        const friend = await User.findOne({ userName: username })
        if (!friend) {
            return res.status(404).json({ message: "User not found" })
        }
        if (findMember(group, friend._id)) {
            return res.status(400).json({ message: "User is already a member" })
        }

        group.members.push({
            user_id: friend._id,
            role: "member",
            joined_at: new Date(),
        })
        await group.save()
        await User.findByIdAndUpdate(friend._id, {
            $addToSet: { groupIds: group._id.toString() },
        })
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "member_added",
            meta: {
                target_user_id: friend._id,
                target_username: friend.userName,
            },
        })

        const profiles = await enrichMembers(group.members.map((m) => m.user_id))
        res.status(201).json({ group: serializeGroup(group, profiles) })
    } catch (error) {
        handleError(res, error)
    }
}

export const removeMember = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const targetUserId = param(req.params.userId)
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }

        const isSelf = uid === targetUserId
        if (!isSelf) {
            assertGroupAdmin(group, uid)
        } else {
            assertGroupMember(group, uid)
        }

        const target = findMember(group, targetUserId)
        if (!target) {
            return res.status(404).json({ message: "User is not a member" })
        }

        if (isLastAdmin(group, targetUserId)) {
            return res.status(400).json({
                message:
                    "Cannot remove the last admin. Promote another member or delete the group.",
            })
        }

        group.members = group.members.filter((m) => m.user_id !== targetUserId)
        await group.save()
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { groupIds: group._id.toString() },
        })
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "member_removed",
            meta: { target_user_id: targetUserId },
        })

        res.json({ message: isSelf ? "Left group" : "Member removed" })
    } catch (error) {
        handleError(res, error)
    }
}

export const updateMemberRole = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const targetUserId = param(req.params.userId)
        const { role } = req.body
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupAdmin(group, uid)
        canChangeRole(group, targetUserId, role)

        const target = findMember(group, targetUserId)!
        target.role = role
        await group.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "role_changed",
            meta: { target_user_id: targetUserId, role },
        })

        const profiles = await enrichMembers(group.members.map((m) => m.user_id))
        res.json({ group: serializeGroup(group, profiles) })
    } catch (error) {
        handleError(res, error)
    }
}

export const getGroupLists = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        const lists = await ListModel.find({
            list_id: { $in: group.list_ids },
            list_type: "group",
        }).sort({ date_created: -1 })

        res.json({
            lists,
            limits: {
                max_lists: MAX_GROUP_LISTS,
                max_movies: MAX_LIST_MOVIES,
                list_count: group.list_ids.length,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const createGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (group.list_ids.length >= MAX_GROUP_LISTS) {
            return res.status(400).json({
                message: `Groups can have at most ${MAX_GROUP_LISTS} lists`,
            })
        }

        const list_id = new mongoose.Types.ObjectId().toString()
        const list = await ListModel.create({
            list_id,
            name: req.body.name,
            description: req.body.description ?? "",
            list_type: "group",
            group_id: group._id.toString(),
            movies: [],
            members: [{ user_id: uid, is_author: true }],
            isPublic: false,
            date_created: new Date(),
        })

        group.list_ids.push(list_id)
        await group.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "list_created",
            meta: { list_id, list_name: list.name },
        })

        res.status(201).json({ list })
    } catch (error) {
        handleError(res, error)
    }
}

export const deleteGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const group = await loadGroup(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (!group.list_ids.includes(listId)) {
            return res.status(404).json({ message: "List not found in group" })
        }

        const list = await ListModel.findOneAndDelete({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        group.list_ids = group.list_ids.filter((id) => id !== listId)
        await group.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "list_deleted",
            meta: { list_id: listId, list_name: list.name },
        })

        res.json({ message: "List deleted" })
    } catch (error) {
        handleError(res, error)
    }
}

export const getGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const group = await loadGroup(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (!group.list_ids.includes(listId)) {
            return res.status(404).json({ message: "List not found in group" })
        }

        const list = await ListModel.findOne({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        res.json({
            list,
            limits: {
                max_movies: MAX_LIST_MOVIES,
                movie_count: list.movies.length,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const addMovieToGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const group = await loadGroup(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (!group.list_ids.includes(listId)) {
            return res.status(404).json({ message: "List not found in group" })
        }

        const list = await ListModel.findOne({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        if (list.movies.length >= MAX_LIST_MOVIES) {
            return res.status(400).json({
                message: `Lists can have at most ${MAX_LIST_MOVIES} movies`,
            })
        }

        if (list.movies.some((m) => m.movie_id === req.body.movie_id)) {
            return res.status(400).json({ message: "Movie already in list" })
        }

        list.movies.push({
            movie_id: req.body.movie_id,
            title: req.body.title,
            poster_path: req.body.poster_path,
            release_date: req.body.release_date,
            genre_ids: req.body.genre_ids,
        })
        await list.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "movie_added",
            meta: {
                list_id: listId,
                list_name: list.name,
                movie_id: req.body.movie_id,
                movie_title: req.body.title,
            },
        })

        res.status(201).json({ list })
    } catch (error) {
        handleError(res, error)
    }
}

export const removeMovieFromGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const movieId = param(req.params.movieId)
        const group = await loadGroup(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (!group.list_ids.includes(listId)) {
            return res.status(404).json({ message: "List not found in group" })
        }

        const list = await ListModel.findOne({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        const movie = list.movies.find((m) => m.movie_id === movieId)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found in list" })
        }

        list.movies = list.movies.filter((m) => m.movie_id !== movieId)
        await list.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "movie_removed",
            meta: {
                list_id: listId,
                list_name: list.name,
                movie_id: movieId,
                movie_title: movie.title,
            },
        })

        res.json({ list })
    } catch (error) {
        handleError(res, error)
    }
}

export const getGroupActivity = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        const page = Number(req.query.page ?? 1)
        const limit = Number(req.query.limit ?? 20)
        const skip = (page - 1) * limit

        const [items, total] = await Promise.all([
            GroupActivity.find({ group_id: group._id.toString() })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            GroupActivity.countDocuments({ group_id: group._id.toString() }),
        ])

        const actorIds = [...new Set(items.map((a) => a.actor_id))]
        const actors = await enrichMembers(actorIds)
        const actorMap = new Map(actors.map((a) => [a.user_id, a]))

        res.json({
            activity: items.map((a) => ({
                id: a._id.toString(),
                action: a.action,
                meta: a.meta,
                created_at: a.created_at,
                actor: actorMap.get(a.actor_id) ?? {
                    user_id: a.actor_id,
                    userName: "Unknown",
                    profile_image: "",
                },
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}

function calculateStatsFromEntries(
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

export const getGroupStats = async (req: Request, res: Response) => {
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

        const allEntries = members.flatMap((m) =>
            (m.journal || []).map((j) => ({
                movie: j.movie,
                dateWatched: j.dateWatched,
                rating: j.rating,
                userName: m.userName,
            }))
        )

        const stats = calculateStatsFromEntries(allEntries)
        const perMember = members.map((m) => ({
            user_id: m._id,
            userName: m.userName,
            watched: m.journal?.length ?? 0,
        }))

        res.json({ stats, perMember, entryCount: allEntries.length })
    } catch (error) {
        handleError(res, error)
    }
}

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
