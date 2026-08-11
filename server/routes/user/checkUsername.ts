import { Router } from "express"
import { checkUsernameAvailability } from "../../controllers/user/checkUsernameAvailability"

const router = Router()
router.get("/check-username/:userName", checkUsernameAvailability)
export default router
