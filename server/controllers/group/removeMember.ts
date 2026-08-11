import type { Request, Response } from "express"
import User from "../../models/User"
import {
    assertGroupAdmin,
    assertGroupMember,
    findMember,
    isLastAdmin,
} from "../../utils/groupPermissions"
import { handleError, loadGroup, logActivity, param } from "./helpers"

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
