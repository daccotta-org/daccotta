import { type Request, type Response } from "express"
import User from "../../models/User"
import mongoose from "mongoose"

export const deleteJournalEntry = async (req: Request, res: Response) => {
    try {
        const entryId = req.params.entryId as string
        const userId = req.user?.uid

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    journal: { _id: new mongoose.Types.ObjectId(entryId) },
                },
            },
            { new: true }
        )

        if (!updatedUser) {
            return res
                .status(404)
                .json({ error: "User or journal entry not found" })
        }

        res.status(200).json({
            message: "Journal entry deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting journal entry:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
