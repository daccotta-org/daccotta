import { type Request, type Response } from "express"
import User from "../../models/User"

export const getPersonalUserData = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params

        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(user)
    } catch (error) {
        console.error("Error fetching user data:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
