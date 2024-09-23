import { type Request, type Response } from "express"
import User from "../models/User"
import mongoose from "mongoose"
import type { MovieInList } from "../models/movie"

export const addJournalEntry = async (req: Request, res: Response) => {
    try {
        const { movie, dateWatched, rewatches } = req.body
        const userId = req.user?.uid

        console.log("userId is : ", userId)
        console.log("req.user is : ", req.user)
        console.log("req.body is : ", req.body)

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const movieData: MovieInList = {
            movie_id: movie.movie_id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
        }

        const newJournalEntry = {
            _id: new mongoose.Types.ObjectId(),
            movie: movieData,
            dateWatched: new Date(dateWatched),
            rewatches: rewatches || 1,
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { journal: newJournalEntry } },
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(201).json({
            message: "Journal entry added successfully",
            journalEntry: newJournalEntry,
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error adding journal entry:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

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

export const deleteJournalEntry = async (req: Request, res: Response) => {
    try {
        const { entryId } = req.params
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

// ... (getJournalEntries function remains the same)
