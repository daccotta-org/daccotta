import { Router } from "express"
import { validate } from "../../middleware/validate"
import {
    createGroupListSchema,
    groupIdParams,
} from "../../validation/groupSchemas"
import { createGroupList } from "../../controllers/group/createGroupList"

const router = Router()
router.post(
    "/:groupId/lists",
    validate({ params: groupIdParams, body: createGroupListSchema }),
    createGroupList
)
export default router
