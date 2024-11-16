import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import { createList, getMoveList, removeList } from "../controllers/listController"
import { addMovie, addMovieInList, removeMovie } from "../controllers/movieController"

const router = Router()

router.get("/:uid", verifyToken, getMoveList)
router.post("/create", verifyToken, createList)
//delete list by id
router.delete("/:listId/remove-list", verifyToken, removeList);
router.post("/:listId/add-movie", verifyToken, addMovie)
// Add remove-movie endpoint
router.delete("/:listId/remove-movie", verifyToken, removeMovie)
// Add movie to list endpoint
router.post("/:listId/add-movie-in-list", verifyToken, addMovieInList);

export { router as listRoutes }
