import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams, paginationQuery } from "../../validation/groupSchemas"
import { getGroupActivity } from "../../controllers/group/getGroupActivity"

const router = Router()
router.get(
    "/:groupId/activity",
    validate({ params: groupIdParams, query: paginationQuery }),
    getGroupActivity
)
export default router
