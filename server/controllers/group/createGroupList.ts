import type { Request, Response } from "express"
import mongoose from "mongoose"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { MAX_GROUP_LISTS } from "../../validation/groupSchemas"
import { handleError, loadGroup, logActivity, param } from "./helpers"

export const createGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const group = await loadGroup(param(req.params.groupId))
        if (!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        assertGroupMember(group, uid)

        if (group.list_ids.length >= MAX_GROUP_LISTS) {
            return res.status(400).json({
                message: `Groups can have at most ${MAX_GROUP_LISTS} lists`,
            })
        }

        const list_id = new mongoose.Types.ObjectId().toString()
        const list = await ListModel.create({
            list_id,
            name: req.body.name,
            description: req.body.description ?? "",
            list_type: "group",
            group_id: group._id.toString(),
            movies: [],
            members: [{ user_id: uid, is_author: true }],
            isPublic: false,
            date_created: new Date(),
        })

        group.list_ids.push(list_id)
        await group.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "list_created",
            meta: { list_id, list_name: list.name },
        })

        res.status(201).json({ list })
    } catch (error) {
        handleError(res, error)
    }
}
