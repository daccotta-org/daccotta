import type { Request, Response } from "express"
import GroupActivity from "../../models/GroupActivity"
import ListModel from "../../models/List"
import User from "../../models/User"
import { assertGroupAdmin } from "../../utils/groupPermissions"
import { handleError, loadGroup, param } from "./helpers"

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
