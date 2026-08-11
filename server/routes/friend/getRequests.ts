import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getAllFriendRequests } from "../../controllers/friend/getAllFriendRequests"

const router = Router()
router.get("/requests", verifyToken, getAllFriendRequests)
export default router
