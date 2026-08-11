import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { updateUserProfile } from "../../controllers/user/updateUserProfile"

const router = Router()
router.put("/:uid/profile", verifyToken, updateUserProfile)
export default router
