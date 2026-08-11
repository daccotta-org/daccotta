import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { updateProfileImage } from "../../controllers/user/updateProfileImage"

const router = Router()
router.put("/:userId/update-profile-image", verifyToken, updateProfileImage)
export default router
