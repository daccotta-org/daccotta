import type { Request, Response } from "express"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { MAX_GROUP_LISTS, MAX_LIST_MOVIES } from "../../validation/groupSchemas"
import { handleError, loadGroup, param } from "./helpers"

export const getGroupLists = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        const lists = await ListModel.find({
            list_id: { $in: group.list_ids },
            list_type: "group",
        }).sort({ date_created: -1 })

        res.json({
            lists,
            limits: {
                max_lists: MAX_GROUP_LISTS,
                max_movies: MAX_LIST_MOVIES,
                list_count: group.list_ids.length,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}
