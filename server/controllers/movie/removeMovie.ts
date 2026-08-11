import { type Request, type Response } from "express"
import User from "../../models/User"

export const removeMovie = async (req: Request, res: Response) => {
    try {
        const { listId } = req.params;
        const { movie_id } = req.body; // Expecting movie_id in request body
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Update the user's lists to reflect the removal of the movie
        await User.findOneAndUpdate(
            { _id: userId, "lists.list_id": listId },
            { $pull: { "lists.$.movies": { movie_id } } },
            { new: true }
        );

        res.status(200).json({
            message: "Movie removed from the list successfully",
        });
    } catch (error) {
        console.error("Error removing movie from list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
