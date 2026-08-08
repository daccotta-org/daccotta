import type { Request, Response, NextFunction } from "express"
import { getAuth } from "firebase-admin/auth"

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization
        const idToken = authHeader && authHeader.split("Bearer ")[1]

        if (!idToken) {
            return res.status(401).json({ error: "No token provided" })
        }
        const decodedToken = await getAuth().verifyIdToken(idToken)
        // Attach the decoded token to the request object
        req.user = decodedToken

        next()
    } catch (error) {
        console.error("Error verifying token:", error)
        res.status(403).json({ error: "Unauthorized" })
    }
}
