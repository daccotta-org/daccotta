import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { sendRequest } from "../../controllers/friend/sendRequest"

const router = Router()
router.post("/request", verifyToken, sendRequest)
export default router
