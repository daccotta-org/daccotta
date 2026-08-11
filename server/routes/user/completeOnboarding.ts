import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { completeOnboarding } from "../../controllers/user/completeOnboarding"

const router = Router()
router.post("/:uid/complete-onboarding", verifyToken, completeOnboarding)
export default router
