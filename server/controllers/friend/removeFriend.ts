import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * Note: removes friend 
 */
export const removeFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { friendUserName } = req.body
        const user = await User.findById(req.user?.uid)
        const friend = await User.findOne({ userName: friendUserName })

        if (user && friend) {
            user.friends = user.friends.filter(
                (username) => username !== friendUserName
            )
            friend.friends = friend.friends.filter(
                (username) => username !== user.userName
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
