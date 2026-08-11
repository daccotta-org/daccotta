import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { removeFriend } from "../../controllers/friend/removeFriend"

const router = Router()
router.post("/remove", verifyToken, removeFriend)
export default router
