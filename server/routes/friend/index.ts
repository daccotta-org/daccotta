import { Router } from "express"
import getFriends from "./getFriends"
import sendRequest from "./sendRequest"
import respond from "./respond"
import remove from "./remove"
import getRequests from "./getRequests"
import getFriendInfo from "./getFriendInfo"
import getTopMovies from "./getTopMovies"

const router = Router()

router.use(getFriends)
router.use(sendRequest)
router.use(respond)
router.use(remove)
router.use(getRequests)
router.use(getFriendInfo)
router.use(getTopMovies)

export { router as friendRoutes }
