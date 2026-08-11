import type { Request, Response } from "express"
import ListModel from "../../models/List"
import { assertGroupMember } from "../../utils/groupPermissions"
import { handleError, loadGroup, logActivity, param } from "./helpers"

export const removeMovieFromGroupList = async (req: Request, res: Response) => {
    try {
        const uid = req.user!.uid
        const groupId = param(req.params.groupId)
        const listId = param(req.params.listId)
        const movieId = param(req.params.movieId)
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

        const movie = list.movies.find((m) => m.movie_id === movieId)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found in list" })
        }

        list.movies = list.movies.filter((m) => m.movie_id !== movieId)
        await list.save()
        await logActivity({
            group_id: group._id.toString(),
            actor_id: uid,
            action: "movie_removed",
            meta: {
                list_id: listId,
                list_name: list.name,
                movie_id: movieId,
                movie_title: movie.title,
            },
        })

        res.json({ list })
    } catch (error) {
        handleError(res, error)
    }
}
