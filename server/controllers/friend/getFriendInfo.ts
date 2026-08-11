import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * @returns the list of friend info based on the username.
 */
export const getFriendInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params
        const friendData = await User.findOne({ userName: username }).select('-password')
        
        if (!friendData) {
            return res.status(404).json({ message: "Friend not found" })
        }

        res.status(200).json(friendData)
    } catch (error) {
        next(error)
    }
}
