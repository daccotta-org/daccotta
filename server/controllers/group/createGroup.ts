import type { Request, Response } from "express"
import Group from "../../models/Group"
import User from "../../models/User"
import { enrichMembers, handleError, serializeGroup } from "./helpers"

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
