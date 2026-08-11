import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getMoveList } from "../../controllers/list/getMoveList"

const router = Router()
router.get("/:uid", verifyToken, getMoveList)
export default router
