import { Router } from "express"
import createUser from "./createUser"
import checkEmail from "./checkEmail"
import getPersonalUserData from "./getPersonalUserData"
import getOtherUserData from "./getOtherUserData"
import updateProfile from "./updateProfile"
import checkOnboarded from "./checkOnboarded"
import completeOnboarding from "./completeOnboarding"
import checkUsername from "./checkUsername"
import searchUsers from "./searchUsers"
import updateProfileImage from "./updateProfileImage"

const router = Router()

// Preserve original registration order
router.use(createUser)
router.use(checkEmail)
router.use(getPersonalUserData)
router.use(getOtherUserData)
router.use(updateProfile)
router.use(checkOnboarded)
router.use(completeOnboarding)
router.use(checkUsername)
router.use(searchUsers)
router.use(updateProfileImage)

export { router as userRoutes }
