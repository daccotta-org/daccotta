import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getOtherUserData } from "../../controllers/user/getOtherUserData"

const router = Router()
router.get("/:uid/other", verifyToken, getOtherUserData)
export default router
