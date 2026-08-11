import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"
import ListModel from "../../models/List"

/**
 * Fetch a single list by list_id.
 * Prefers the copy embedded on the owning user (source of truth for movies),
 * falls back to the List collection.
 */
export const getListById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { listId } = req.params
        const viewerId = req.user?.uid

        if (!listId) {
            return res.status(400).json({ message: "listId is required" })
        }

        const owner = await User.findOne(
            { "lists.list_id": listId },
            { userName: 1, lists: { $elemMatch: { list_id: listId } } }
        )

        if (owner?.lists?.[0]) {
            const list = owner.lists[0]
            const isOwner = String(owner._id) === String(viewerId)
            return res.status(200).json({
                list,
                ownerUserName: owner.userName,
                isOwner,
            })
        }

        const standalone = await ListModel.findOne({ list_id: listId }).lean()
        if (!standalone) {
            return res.status(404).json({ message: "List not found" })
        }

        const isOwner = Boolean(
            viewerId &&
                standalone.members?.some(
                    (m) => m.user_id === viewerId && m.is_author
                )
        )

        return res.status(200).json({
            list: standalone,
            ownerUserName: null,
            isOwner,
        })
    } catch (error) {
        next(error)
    }
}
