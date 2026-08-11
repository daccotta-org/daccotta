import { Router } from "express"
import { validate } from "../../middleware/validate"
import { createGroupSchema } from "../../validation/groupSchemas"
import { createGroup } from "../../controllers/group/createGroup"

const router = Router()
router.post("/", validate({ body: createGroupSchema }), createGroup)
export default router
