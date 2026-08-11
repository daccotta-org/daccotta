import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

export const acceptRejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId, action } = req.body
        const user = await User.findById(req.user?.uid)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const requestIndex = user.friendRequests.findIndex(
            (request) => request._id && request._id.toString() === requestId
        )

        if (requestIndex === -1) {
            return res
                .status(404)
                .json({ message: "Friend request not found" })
        }

        const request = user.friendRequests[requestIndex]

        if (action === "accept") {
            request.status = "accepted"
            if (!user.friends.includes(request.from)) {
                user.friends.push(request.from)
            }
            const friend = await User.findOne({ userName: request.from })
            if (friend) {
                if (!friend.friends.includes(user.userName)) {
                    friend.friends.push(user.userName)
                }
                // Resolve any reciprocal pending request so the other side
                // cannot accept again and re-add the same friend.
                friend.friendRequests.forEach((r) => {
                    if (
                        r.from === user.userName &&
                        r.status === "pending"
                    ) {
                        r.status = "accepted"
                    }
                })
                await friend.save()
            }
        } else if (action === "reject") {
            request.status = "rejected"
        } else {
            return res.status(400).json({ message: "Invalid action" })
        }

        user.friendRequests[requestIndex] = request
        await user.save()
        res.status(200).json({
            message: `Friend request ${action}ed successfully`,
        })
    } catch (error) {
        next(error)
    }
}
