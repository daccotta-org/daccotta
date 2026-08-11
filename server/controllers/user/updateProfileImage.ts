import { type Request, type Response } from "express"
import User from "../../models/User"

export const updateProfileImage = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const userIdFromToken = req.user?.uid

        if (!userIdFromToken || userIdFromToken !== userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { profileImage } = req.body

        if (!profileImage) {
            return res
                .status(400)
                .json({ error: "Profile image URL is required" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile_image: profileImage },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({
            message: "Profile image updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error updating profile image:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
