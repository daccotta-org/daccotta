import { type Request, type Response } from "express"
import User from "../../models/User"

/**
 * Note: Check if the username is available when input.
 */
export const checkUsernameAvailability = async (
    req: Request,
    res: Response
) => {
    try {
        const userName = req.params.userName as string

        const existingUser = await User.findOne({
            userName: userName.toLowerCase(),
        })

        res.json({ isAvailable: !existingUser })
    } catch (error) {
        console.error("Error checking username availability:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
