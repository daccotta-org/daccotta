import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * @returns list of movies created by specific user. 
 */
export const getMoveList = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { uid } = req.params;

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
