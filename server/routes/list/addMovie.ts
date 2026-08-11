import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { addMovie } from "../../controllers/movie/addMovie"

const router = Router()
router.post("/:listId/add-movie", verifyToken, addMovie)
export default router
