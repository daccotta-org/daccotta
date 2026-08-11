import { Router } from "express"
import { checkEmailExists } from "../../controllers/user/checkEmailExists"

const router = Router()
router.post("/check-email", checkEmailExists)
export default router
