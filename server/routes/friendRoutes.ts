import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import { 
    acceptRejectRequest,
    getAllFriendRequests, 
    getFriendInfo, 
    getFriends, 
    getFriendTopMovies, 
    removeFriend, 
    sendRequest 
} from "../controllers/friendController"

const router = Router()

router.get("/", verifyToken, getFriends);
router.post("/request", verifyToken, sendRequest);
router.post("/respond", verifyToken, acceptRejectRequest);
router.post("/remove", verifyToken, removeFriend);
router.get("/requests",verifyToken, getAllFriendRequests);
router.get("/data/:username", verifyToken, getFriendInfo);
router.get("/top-movies", verifyToken, getFriendTopMovies)

export { router as friendRoutes }
