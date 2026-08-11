import { Router } from "express"
import getListById from "./getListById"
import getMoveList from "./getMoveList"
import createList from "./createList"
import removeList from "./removeList"
import addMovie from "./addMovie"
import removeMovie from "./removeMovie"
import addMovieInList from "./addMovieInList"

const router = Router()

// /id/:listId must be registered before /:uid
router.use(getListById)
router.use(getMoveList)
router.use(createList)
router.use(removeList)
router.use(addMovie)
router.use(removeMovie)
router.use(addMovieInList)

export { router as listRoutes }
