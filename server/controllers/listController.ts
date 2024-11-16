import type { Request, Response, NextFunction } from "express"
import User, { type List } from "../models/User";
import ListModel from "../models/List";

/**
 * 
 * @param req 
 * @param res 
 * @param next
 * @returns list of movies created by specific user. 
 */
export const getMoveList = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { uid } = req.params;``

        const page = parseInt(req.query["page"] as string);
        const limit = parseInt(req.query["limit"] as string);
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res.status(400).json({ message: "Invalid query params for pagination" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const movieLists = await User.aggregate([
            { $match: {_id: uid} },
            { $project: {lists: 1} },
            { $unwind: "$lists" },
            {
                $facet: {
                    data: [
                        { $skip: startIndex }, // Skip documents based on pagination
                        { $limit: endIndex }, // Limit to the specified page size
                        { $group: { _id: "$_id", lists: { $push: "$lists" }}} // Group to reassemble lists
                    ],
                    meta: [
                        { $count: "totalCount" } // Count total documents in the lists array
                    ]
                }
            }
        ]);

        const totalPages = Math.ceil(movieLists[0].meta[0].totalCount / limit);

        movieLists[0].meta[0].limit = limit;
        movieLists[0].meta[0].totalPages = totalPages;

        res.status(200).json(movieLists[0]);
    }catch(error) {
        next(error);
    }
}


export const createList =  async (req: Request, res: Response) => {
    try {
        const { name, description, isPublic, list_type, movies, members } =
            req.body
        const userId = req.user?.uid

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const newListData: Partial<List> = {
            name: name,
            list_type: list_type || "user",
            movies: movies || [],
            members: members || [{ user_id: userId, is_author: true }],
            date_created: new Date(),
            description: description || "",
            isPublic: isPublic || false,
        }

        console.log("newListData is for the Route call is here: ", newListData)

        // Create a new list
        const newList = new ListModel(newListData)
        const savedList = await newList.save()

        console.log("savedList is: ", savedList)

        // Update the user's lists
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { lists: savedList } }, // Push the entire list object
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(201).json({
            message: "List created successfully",
            list: savedList,
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error creating list:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const removeList = async (req: Request, res: Response) => {
    try {
        const { listId } = req.params;``
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