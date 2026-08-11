import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { searchUsers } from "../../controllers/user/searchUsers"

const router = Router()
router.get("/:uid/search", verifyToken, searchUsers)
export default router
