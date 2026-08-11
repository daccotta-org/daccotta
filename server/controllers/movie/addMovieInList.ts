import { type Request, type Response } from "express"
import User from "../../models/User"

export const addMovieInList = async (req: Request, res: Response) => {
    try {
        const { listId } = req.params;
        const { movie_id, title, poster_path, release_date } = req.body; // Expecting movie details in request body
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Update the user's lists to add the movie
        await User.findOneAndUpdate(
            { _id: userId, "lists.list_id": listId },
            { $addToSet: { "lists.$.movies": { movie_id, title, poster_path, release_date } } }, // Use $addToSet to prevent duplicates
            { new: true }
        );

        res.status(200).json({
            message: "Movie added to the list successfully",
        });
    } catch (error) {
        console.error("Error adding movie to list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
