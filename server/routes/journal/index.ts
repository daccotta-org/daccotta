import { Router } from "express"
import add from "./add"
import getEntries from "./getEntries"
import getFriendEntries from "./getFriendEntries"
import update from "./update"
import deleteRoute from "./delete"

const router = Router()

console.log("I am here in journalRoutes")

router.use(add)
router.use(getEntries)
router.use(getFriendEntries)
router.use(update)
router.use(deleteRoute)

export { router as journalRoutes }
