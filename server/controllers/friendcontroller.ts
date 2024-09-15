import type { Request, Response, NextFunction } from "express"
import User from "../models/User"

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
