import { type Request, type Response } from "express"
import User from "../../models/User"

/**
 * Note: Check if the email exists.
 */
export const checkEmailExists = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(200).json({ exists: true })
        } else {
            return res.status(200).json({ exists: false })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}
