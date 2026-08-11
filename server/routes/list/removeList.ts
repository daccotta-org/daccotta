import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { removeList } from "../../controllers/list/removeList"

const router = Router()
router.delete("/:listId/remove-list", verifyToken, removeList)
export default router
