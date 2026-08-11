import { Router } from "express"
import { validate } from "../../middleware/validate"
import { addMemberSchema, groupIdParams } from "../../validation/groupSchemas"
import { addMember } from "../../controllers/group/addMember"

const router = Router()
router.post(
    "/:groupId/members",
    validate({ params: groupIdParams, body: addMemberSchema }),
    addMember
)
export default router
