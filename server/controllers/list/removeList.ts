import type { Request, Response } from "express"
import User from "../../models/User"
import ListModel from "../../models/List"

export const removeList = async (req: Request, res: Response) => {
    try {
        const { listId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Find the list by listId and check if the user is the author
        
        const user = await User.findOne({ _id: userId });
        let list = null
        if (user) {
            list = user.lists.find(list => list.list_id === listId);
            if (list) {
                console.log("Found list:", list);
            } else {
                console.log("List not found.");
            }
        } else {
            console.log("User not found.");
        }

        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }

        // Ensure that the user is the author of the list
        const isAuthor = list.members.some(
            (member) => member.user_id === userId && member.is_author
        );

        if (!isAuthor) {
            return res.status(403).json({ error: "You are not authorized to delete this list" });
        }

        // Delete the list
        await ListModel.deleteOne({ list_id: listId });

        await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { lists: { list_id: listId } } }, // Use $pull to remove the list with the specified list_id
            { new: true }
        );

        res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
        console.error("Error deleting list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
