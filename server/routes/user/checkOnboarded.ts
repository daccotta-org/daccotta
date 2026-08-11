import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { checkOnboardedStatus } from "../../controllers/user/checkOnboardedStatus"

const router = Router()
router.get("/:uid/onboarded", verifyToken, checkOnboardedStatus)
export default router
