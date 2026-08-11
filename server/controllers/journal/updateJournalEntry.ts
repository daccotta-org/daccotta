import { type Request, type Response } from "express"
import User from "../../models/User"

export const updateJournalEntry = async (req: Request, res: Response) => {
    try {
        const { entryId } = req.params
        const { movie, dateWatched, rewatches } = req.body
        const userId = req.user?.uid

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "journal._id": entryId },
            {
                $set: {
                    "journal.$.movie": movie,
                    "journal.$.dateWatched": new Date(dateWatched),
                    "journal.$.rewatches": rewatches,
                },
            },
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res
                .status(404)
                .json({ error: "User or journal entry not found" })
        }

        const updatedEntry = updatedUser.journal.find(
            (entry) => entry._id.toString() === entryId
        )

        res.status(200).json({
            message: "Journal entry updated successfully",
            journalEntry: updatedEntry,
        })
    } catch (error) {
        console.error("Error updating journal entry:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
