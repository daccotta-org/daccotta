import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getFriendInfo } from "../../controllers/friend/getFriendInfo"

const router = Router()
router.get("/data/:username", verifyToken, getFriendInfo)
export default router
