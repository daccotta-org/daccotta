import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getFriends } from "../../controllers/friend/getFriends"

const router = Router()
router.get("/", verifyToken, getFriends)
export default router
