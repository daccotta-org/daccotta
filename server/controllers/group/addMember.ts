import type { Request, Response } from "express"
import User from "../../models/User"
import {
    assertGroupAdmin,
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
