import { Router } from "express"
import { validate } from "../../middleware/validate"
import { addMovieSchema, groupListParams } from "../../validation/groupSchemas"
import { addMovieToGroupList } from "../../controllers/group/addMovieToGroupList"

const router = Router()
router.post(
    "/:groupId/lists/:listId/movies",
    validate({ params: groupListParams, body: addMovieSchema }),
    addMovieToGroupList
)
export default router
