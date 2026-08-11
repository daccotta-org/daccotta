import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { addMovieInList } from "../../controllers/movie/addMovieInList"

const router = Router()
router.post("/:listId/add-movie-in-list", verifyToken, addMovieInList)
export default router
