import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupIdParams } from "../../validation/groupSchemas"
import { getGroupRecommendations } from "../../controllers/group/getGroupRecommendations"

const router = Router()
router.get(
    "/:groupId/recommendations",
    validate({ params: groupIdParams }),
    getGroupRecommendations
)
export default router
