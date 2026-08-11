import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * @returns list of friends based on specific id.
 */
export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query['page'] as string, 10);
        const limit = parseInt(req.query['limit'] as string, 10);        
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res.status(400).json({ message: "Invalid query params for pagination" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = await User.aggregate([
            { $match: { _id: req.user?.uid } },
            // Collapse duplicate usernames left by older mutual-accept bugs
            { $project: { friends: { $setUnion: ["$friends", []] } } },
            { $unwind: "$friends" },
            {
                $facet: {
                    data: [
                        { $skip: startIndex }, // Skip documents based on pagination
                        { $limit: endIndex }, // Limit to the specified page size
                        { $group: { _id: "$_id", friends: { $push: "$friends" } } } // Reassemble friends array after pagination
                    ],
                    meta: [
                        { $count: "totalCount" } // Get the total count of friends
                    ]
                }
            }
        ]);

        const friendsData = result[0]?.data[0]?.friends || [];
        const totalCount = result[0]?.meta[0]?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            friends: friendsData,
            meta: {
                totalCount,
                limit: limit,
                totalPages
            }
        })
    } catch (error) {
        next(error)
    }
}
