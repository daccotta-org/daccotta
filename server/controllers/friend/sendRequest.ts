import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

export const sendRequest =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { friendUserName } = req.body

        const user = await User.findById(req.user?.uid)
        const friend = await User.findOne({ userName: friendUserName })

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.friends.includes(friendUserName)) {
            return res.status(400).json({ message: "Already friends" })
        }

        const existingRequest = friend.friendRequests.find(
            (request) =>
                request.from === user.userName &&
                request.status === "pending"
        )

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Friend request already sent" })
        }

        // If the other user already sent us a pending request, accept that
        // instead of creating a reciprocal pending request (which would
        // duplicate both friends lists if both sides later accept).
        const reciprocalRequest = user.friendRequests.find(
            (request) =>
                request.from === friendUserName &&
                request.status === "pending"
        )

        if (reciprocalRequest) {
            reciprocalRequest.status = "accepted"
            if (!user.friends.includes(friendUserName)) {
                user.friends.push(friendUserName)
            }
            if (!friend.friends.includes(user.userName)) {
                friend.friends.push(user.userName)
            }
            await Promise.all([user.save(), friend.save()])
            return res.status(200).json({
                message: "Friend request accepted successfully",
            })
        }

        friend.friendRequests.push({
            from: user.userName,
            to: friendUserName,
            status: "pending",
            createdAt: new Date(),
        })

        await friend.save()
        console.log(
            "Friend request sent successfully",
            friend.friendRequests
        )
        res.status(200).json({
            message: "Friend request sent successfully",
        })
    } catch (error) {
        next(error)
    }
}
