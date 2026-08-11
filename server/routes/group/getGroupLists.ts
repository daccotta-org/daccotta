import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams } from "../../validation/groupSchemas"
import { getGroupLists } from "../../controllers/group/getGroupLists"

const router = Router()
router.get("/:groupId/lists", validate({ params: groupIdParams }), getGroupLists)
export default router
