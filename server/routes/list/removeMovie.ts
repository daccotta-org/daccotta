import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { removeMovie } from "../../controllers/movie/removeMovie"

const router = Router()
router.delete("/:listId/remove-movie", verifyToken, removeMovie)
export default router
