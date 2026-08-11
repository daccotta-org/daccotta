import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { acceptRejectRequest } from "../../controllers/friend/acceptRejectRequest"

const router = Router()
router.post("/respond", verifyToken, acceptRejectRequest)
export default router
