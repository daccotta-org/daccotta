import type { Request, Response } from "express"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { handleError, loadGroup, logActivity, param } from "./helpers"

export const deleteGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const group = await loadGroup(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (!group.list_ids.includes(listId)) {
            return res.status(404).json({ message: "List not found in group" })
        }

        const list = await ListModel.findOneAndDelete({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        group.list_ids = group.list_ids.filter((id) => id !== listId)
        await group.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "list_deleted",
            meta: { list_id: listId, list_name: list.name },
        })

        res.json({ message: "List deleted" })
    } catch (error) {
        handleError(res, error)
    }
}
