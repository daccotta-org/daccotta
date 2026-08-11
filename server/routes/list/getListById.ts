import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getListById } from "../../controllers/list/getListById"

const router = Router()
router.get("/id/:listId", verifyToken, getListById)
export default router
