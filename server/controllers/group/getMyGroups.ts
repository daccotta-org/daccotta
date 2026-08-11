import type { Request, Response } from "express"
import Group from "../../models/Group"
import { enrichMembers, handleError, serializeGroup } from "./helpers"

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
