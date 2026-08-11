import { Router } from "express"
import { validate } from "../../middleware/validate"
import { groupListMovieParams } from "../../validation/groupSchemas"
import { removeMovieFromGroupList } from "../../controllers/group/removeMovieFromGroupList"

const router = Router()
router.delete(
    "/:groupId/lists/:listId/movies/:movieId",
    validate({ params: groupListMovieParams }),
    removeMovieFromGroupList
)
export default router
