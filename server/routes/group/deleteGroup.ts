import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams } from "../../validation/groupSchemas"
import { deleteGroup } from "../../controllers/group/deleteGroup"

const router = Router()
router.delete("/:groupId", validate({ params: groupIdParams }), deleteGroup)
export default router
