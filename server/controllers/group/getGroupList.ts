import type { Request, Response } from "express"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { MAX_LIST_MOVIES } from "../../validation/groupSchemas"
import { handleError, loadGroup, param } from "./helpers"

export const getGroupList = async (req: Request, res: Response) => {
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

        const list = await ListModel.findOne({
            list_id: listId,
            list_type: "group",
            group_id: group._id.toString(),
        })
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }

        res.json({
            list,
            limits: {
                max_movies: MAX_LIST_MOVIES,
                movie_count: list.movies.length,
            },
        })
    } catch (error) {
        handleError(res, error)
    }
}
