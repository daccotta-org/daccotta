import type { Request, Response } from "express"
import GroupActivity from "../../models/GroupActivity"
import { assertGroupMember } from "../../utils/groupPermissions"
import {
    enrichMembers,
    handleError,
    loadGroup,
    param,
} from "./helpers"

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
