import { Router } from "express"
import { getMyGroups } from "../../controllers/group/getMyGroups"

const router = Router()
router.get("/", getMyGroups)
export default router
