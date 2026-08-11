import { type Request, type Response } from "express"
import User from "../../models/User"

export const completeOnboarding = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const { username, profile_image, topMovies, directors, friends } =
            req.body
        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // Update the existing top 5 movies list
        const top5MoviesList = user.lists.find(
            (list) => list.name === "Top 5 Movies"
        )
        if (top5MoviesList) {
            top5MoviesList.movies = topMovies.map((movie: any) => ({
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
            }))
        }

        // Replace fake directors list with user's chosen directors

        user.profile_image = profile_image

        user.onboarded = true

        // Add "Onboarded" badge
        if (!user.badges.includes("Onboarded")) {
            user.badges.push("Onboarded")
        }

        await user.save()

        res.json({
            message: "Onboarding completed successfully",
            user: user,
        })
    } catch (error: unknown) {
        console.error("Error completing onboarding:", error)
        if (error instanceof Error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            })
        } else {
            res.status(500).json({
                error: "Internal server error",
                details: "An unknown error occurred",
            })
        }
    }
}
