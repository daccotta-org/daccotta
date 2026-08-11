import { type Request, type Response } from "express"
import User from "../../models/User"

export const getJournalEntries = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await User.findById(userId).select("journal")

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({
            message: "Journal entries retrieved successfully",
            journalEntries: user.journal,
        })
    } catch (error) {
        console.error("Error retrieving journal entries:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
