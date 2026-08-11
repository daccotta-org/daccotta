import type { Request, Response } from "express"
import {
    assertGroupAdmin,
    canChangeRole,
    findMember,
} from "../../utils/groupPermissions"
import {
    enrichMembers,
    handleError,
    loadGroup,
    logActivity,
    param,
    serializeGroup,
} from "./helpers"

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
