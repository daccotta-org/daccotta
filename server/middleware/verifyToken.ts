import type { Request, Response, NextFunction } from "express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../lib/auth"

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            return res.status(401).json({ error: "No token provided" })
        }

        req.user = {
            uid: session.user.id,
            email: session.user.email,
        }

        next()
    } catch (error) {
        console.error("Error verifying session:", error)
        res.status(403).json({ error: "Unauthorized" })
    }
}
