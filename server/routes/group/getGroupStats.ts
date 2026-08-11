import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams } from "../../validation/groupSchemas"
import { getGroupStats } from "../../controllers/group/getGroupStats"

const router = Router()
router.get("/:groupId/stats", validate({ params: groupIdParams }), getGroupStats)
export default router
