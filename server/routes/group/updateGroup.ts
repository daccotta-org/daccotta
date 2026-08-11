import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams, updateGroupSchema } from "../../validation/groupSchemas"
import { updateGroup } from "../../controllers/group/updateGroup"

const router = Router()
router.patch(
    "/:groupId",
    validate({ params: groupIdParams, body: updateGroupSchema }),
    updateGroup
)
export default router
