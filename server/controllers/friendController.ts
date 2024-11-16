import type { Request, Response, NextFunction } from "express"
import User, { FriendRequest } from "../models/User"

/**
 * 
 * @param req 
 * @param res 
 * @param next 
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
            { $project: { friends: 1 } },
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

/**
 * 
 * @param req 
 * @param res 
 * @param next 
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
        const endIndex = page * limit;

        const result = await FriendRequest.aggregate([
            {
                $match: {
                    id: req.user?.uid,
                    status: "pending"
                }
            },
            {
                $facet: {
                    meta: [{ $count: "totalCount" }], // Count total pending friend requests
                    data: [
                        { $skip: startIndex }, // Skip documents based on pagination
                        { $limit: limit }, // Limit to the specified page size
                    ]
                }
            }
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

export const getFriendTopMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = await User.findById(req.user?.uid)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const friendsTopMovies = await Promise.all(
            currentUser.friends.map(async (friendUserName) => {
                const friendUser = await User.findOne({
                    userName: friendUserName,
                })
                if (!friendUser) {
                    return null
                }

                const topMoviesList = friendUser.lists.find(
                    (list) => list.name === "Top 5 Movies"
                )

                if (!topMoviesList) {
                    return null
                }

                return {
                    friend: friendUserName,
                    movies: topMoviesList.movies,
                }
            })
        )

        // Filter out any null results (friends not found or without top movies list)
        const validFriendsTopMovies = friendsTopMovies.filter(
            (item) => item !== null
        )

        res.status(200).json(validFriendsTopMovies)
    } catch (error) {
        next(error)
    }
}


/**
 * @param req 
 * @param res 
 * Note: removes friend 
 */
export const removeFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { friendUserName } = req.body
        const user = await User.findById(req.user?.uid)
        const friend = await User.findOne({ userName: friendUserName })

        if (user && friend) {
            user.friends = user.friends.filter(
                (username) => username !== friendUserName
            )
            friend.friends = friend.friends.filter(
                (username) => username !== user.userName
            )
            await user.save()
            await friend.save()
            res.status(200).json({ message: "Friend removed successfully" })
        } else {
            res.status(400).json({
                message: "Friend not found or user not found",
            })
        }
    } catch (error) {
        next(error)
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns the list of friend info based on the username.
 */
export const getFriendInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params
        const friendData = await User.findOne({ userName: username }).select('-password')
        
        if (!friendData) {
            return res.status(404).json({ message: "Friend not found" })
        }

        res.status(200).json(friendData)
    } catch (error) {
        next(error)
    }
}


export const sendRequest =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { friendUserName } = req.body

        const user = await User.findById(req.user?.uid)
        const friend = await User.findOne({ userName: friendUserName })

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.friends.includes(friendUserName)) {
            return res.status(400).json({ message: "Already friends" })
        }

        const existingRequest = friend.friendRequests.find(
            (request) =>
                request.from === user.userName &&
                request.status === "pending"
        )

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Friend request already sent" })
        }

        friend.friendRequests.push({
            from: user.userName,
            to: friendUserName,
            status: "pending",
            createdAt: new Date(),
        })

        await friend.save()
        console.log(
            "Friend request sent successfully",
            friend.friendRequests
        )
        res.status(200).json({
            message: "Friend request sent successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const acceptRejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId, action } = req.body
        const user = await User.findById(req.user?.uid)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const requestIndex = user.friendRequests.findIndex(
            (request) => request._id && request._id.toString() === requestId
        )

        if (requestIndex === -1) {
            return res
                .status(404)
                .json({ message: "Friend request not found" })
        }

        const request = user.friendRequests[requestIndex]

        if (action === "accept") {
            request.status = "accepted"
            user.friends.push(request.from)
            const friend = await User.findOne({ userName: request.from })
            if (friend) {
                friend.friends.push(user.userName)
                await friend.save()
            }
        } else if (action === "reject") {
            request.status = "rejected"
        } else {
            return res.status(400).json({ message: "Invalid action" })
        }

        user.friendRequests[requestIndex] = request
        await user.save()
        res.status(200).json({
            message: `Friend request ${action}ed successfully`,
        })
    } catch (error) {
        next(error)
    }
}