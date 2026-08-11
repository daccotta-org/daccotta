import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupListParams } from "../../validation/groupSchemas"
import { getGroupList } from "../../controllers/group/getGroupList"

const router = Router()
router.get(
    "/:groupId/lists/:listId",
    validate({ params: groupListParams }),
    getGroupList
)
export default router
