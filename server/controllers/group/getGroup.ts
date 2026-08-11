import type { Request, Response } from "express"
import { assertGroupMember } from "../../utils/groupPermissions"
import {
    enrichMembers,
    handleError,
    loadGroup,
    param,
    serializeGroup,
} from "./helpers"

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
