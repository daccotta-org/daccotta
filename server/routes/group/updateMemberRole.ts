import { Router } from "express"
import { validate } from "../../middleware/validate"
import {
    groupMemberParams,
    updateMemberRoleSchema,
} from "../../validation/groupSchemas"
import { updateMemberRole } from "../../controllers/group/updateMemberRole"

const router = Router()
router.patch(
    "/:groupId/members/:userId",
    validate({ params: groupMemberParams, body: updateMemberRoleSchema }),
    updateMemberRole
)
export default router
