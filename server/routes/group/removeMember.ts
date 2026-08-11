import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupMemberParams } from "../../validation/groupSchemas"
import { removeMember } from "../../controllers/group/removeMember"

const router = Router()
router.delete(
    "/:groupId/members/:userId",
    validate({ params: groupMemberParams }),
    removeMember
)
export default router
