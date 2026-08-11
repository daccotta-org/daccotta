import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams } from "../../validation/groupSchemas"
import { getGroup } from "../../controllers/group/getGroup"

const router = Router()
router.get("/:groupId", validate({ params: groupIdParams }), getGroup)
export default router
