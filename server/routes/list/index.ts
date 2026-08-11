import { Router } from "express"
import getMoveList from "./getMoveList"
import createList from "./createList"
import removeList from "./removeList"
import addMovie from "./addMovie"
import removeMovie from "./removeMovie"
import addMovieInList from "./addMovieInList"

const router = Router()

router.use(getMoveList)
router.use(createList)
router.use(removeList)
router.use(addMovie)
router.use(removeMovie)
router.use(addMovieInList)

export { router as listRoutes }
