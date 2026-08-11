import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { createList } from "../../controllers/list/createList"

const router = Router()
router.post("/create", verifyToken, createList)
export default router
