import { type Request, type Response } from "express"
import User from "../../models/User"

/**
 * Note: search user based on the query parameters.
 */
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const { term } = req.query

        // Verify the user
        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        if (!term || typeof term !== "string") {
            return res.status(400).json({ error: "Invalid search term" })
        }
        console.log("term is : ", term)

        const users = await User.find({
            userName: { $regex: term, $options: "i" },
            _id: { $ne: uid }, // Exclude the current user from search results
            onboarded: true,
        }).select("_id userName profile_image")

        console.log("backend users : ", users)
        res.json(users)
    } catch (error) {
        console.error("Error searching users:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
