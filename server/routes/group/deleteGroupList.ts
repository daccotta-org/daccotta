import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupListParams } from "../../validation/groupSchemas"
import { deleteGroupList } from "../../controllers/group/deleteGroupList"

const router = Router()
router.delete(
    "/:groupId/lists/:listId",
    validate({ params: groupListParams }),
    deleteGroupList
)
export default router
