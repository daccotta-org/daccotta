import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getFriendTopMovies } from "../../controllers/friend/getFriendTopMovies"

const router = Router()
router.get("/top-movies", verifyToken, getFriendTopMovies)
export default router
