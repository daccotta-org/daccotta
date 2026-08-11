import type { Request, Response } from "express"
import User from "../../models/User"
import { assertGroupMember } from "../../utils/groupPermissions"
import {
    calculateStatsFromEntries,
    handleError,
    loadGroup,
    param,
} from "./helpers"

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
