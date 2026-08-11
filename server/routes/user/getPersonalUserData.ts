import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getPersonalUserData } from "../../controllers/user/getPersonalUserData"

const router = Router()
router.get("/:uid", verifyToken, getPersonalUserData)
export default router
