import type { Request, Response } from "express"
import { assertGroupAdmin } from "../../utils/groupPermissions"
import {
    enrichMembers,
    handleError,
    loadGroup,
    param,
    serializeGroup,
} from "./helpers"

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
