import type { Request, Response } from "express"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { MAX_LIST_MOVIES } from "../../validation/groupSchemas"
import { handleError, loadGroup, logActivity, param } from "./helpers"

export const addMovieToGroupList = async (req: Request, res: Response) => {
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

        if (list.movies.length >= MAX_LIST_MOVIES) {
            return res.status(400).json({
                message: `Lists can have at most ${MAX_LIST_MOVIES} movies`,
            })
        }

        if (list.movies.some((m) => m.movie_id === req.body.movie_id)) {
            return res.status(400).json({ message: "Movie already in list" })
        }

        list.movies.push({
            movie_id: req.body.movie_id,
            title: req.body.title,
            poster_path: req.body.poster_path,
            release_date: req.body.release_date,
            genre_ids: req.body.genre_ids,
        })
        await list.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "movie_added",
            meta: {
                list_id: listId,
                list_name: list.name,
                movie_id: req.body.movie_id,
                movie_title: req.body.title,
            },
        })

        res.status(201).json({ list })
    } catch (error) {
        handleError(res, error)
    }
}
