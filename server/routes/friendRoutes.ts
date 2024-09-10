import { type Request, type Response, type NextFunction, Router } from "express"
import User from "../models/User"
import { verifyToken } from "../middleware/verifyToken"
import mongoose from "mongoose"

const router = Router()

// Helper function to convert string to ObjectId if needed
const toObjectId = (
    id: string | mongoose.Types.ObjectId
): mongoose.Types.ObjectId => {
    return typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
}

// Route to retrieve list of all friends
router.get(
    "/",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("helloo firends")

            const user = await User.findById(req.user?.uid).populate("friends")

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            res.status(200).json(user?.friends)
            console.log("user friends", user?.friends)
        } catch (error) {
            next(error)
        }
    }
)

// Route to send a friend request
router.post(
    "/request",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { friendId } = req.body
            const user = await User.findById(req.user?.uid)
            const friend = await User.findById(friendId)

            if (!user || !friend) {
                return res.status(404).json({ message: "User not found" })
            }

            if (
                user.friends.some((id) => id.toString() === friendId.toString())
            ) {
                return res.status(400).json({ message: "Already friends" })
            }

            const existingRequest = friend.friendRequests.find(
                (request) =>
                    request.from.toString() === req.user?.uid.toString() &&
                    request.status === "pending"
            )

            if (existingRequest) {
                return res
                    .status(400)
                    .json({ message: "Friend request already sent" })
            }

            friend.friendRequests.push({
                from: toObjectId(req.user?.id),
                to: toObjectId(friendId),
                status: "pending",
                createdAt: new Date(),
            })

            await friend.save()
            res.status(200).json({
                message: "Friend request sent successfully",
            })
        } catch (error) {
            next(error)
        }
    }
)

// Route to accept/reject a friend request
router.post(
    "/respond",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
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
                user.friends.push(toObjectId(request.from))
                const friend = await User.findById(request.from)
                if (friend) {
                    friend.friends.push(toObjectId(user._id))
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
)

// Route to remove a friend
router.post(
    "/remove",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { friendId } = req.body
            const user = await User.findById(req.user?.uid)
            const friend = await User.findById(friendId)

            if (user && friend) {
                user.friends = user.friends.filter(
                    (id) => id.toString() !== friendId.toString()
                )
                friend.friends = friend.friends.filter(
                    (id) => id.toString() !== req.user?.id.toString()
                )
                await user.save()
                await friend.save()
                res.status(200).json({ message: "Friend removed successfully" })
            } else {
                res.status(400).json({
                    message: "Friend not found or user not found",
                })
            }
        } catch (error) {
            next(error)
        }
    }
)

// Route to get pending friend requests
router.get(
    "/requests",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.user?.uid)
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            const pendingRequests = user.friendRequests.filter(
                (request) => request.status === "pending"
            )
            res.status(200).json(pendingRequests)
        } catch (error) {
            next(error)
        }
    }
)

export { router as friendRoutes }
