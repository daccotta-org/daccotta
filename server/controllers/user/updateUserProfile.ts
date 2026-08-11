import { type Request, type Response } from "express"
import User from "../../models/User"

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        console.log("I am on")

        const { uid } = req.params
        const updateData = req.body

        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, updateData, {
            new: true,
        })
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
