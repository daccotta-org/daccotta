import type { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * @returns list of friend requests
 */
export const getAllFriendRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query['page'] as string);
        const limit = parseInt(req.query['limit'] as string);
        if(isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res.status(400).json({message: "Invalid query params for pagination"});
        }

        const startIndex = (page - 1) * limit;

        // Friend requests are embedded on the User document (receiver),
        // not stored in a separate FriendRequest collection.
        const result = await User.aggregate([
            { $match: { _id: req.user?.uid } },
            { $project: { friendRequests: 1 } },
            { $unwind: "$friendRequests" },
            { $match: { "friendRequests.status": "pending" } },
            {
                $facet: {
                    meta: [{ $count: "totalCount" }],
                    data: [
                        { $skip: startIndex },
                        { $limit: limit },
                        { $replaceRoot: { newRoot: "$friendRequests" } },
                    ],
                },
            },
        ]);

        const pendingRequests = result[0]?.data || [];
        const totalCount = result[0]?.meta[0]?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            pendingRequests,
            meta: {
                totalCount,
                limit,
                totalPages,
            }
        });

    } catch (error) {
        next(error)
    }
}
