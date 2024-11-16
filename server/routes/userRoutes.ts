import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import {
    checkEmailExists,
    checkOnboardedStatus,
    checkUsernameAvailability,
    completeOnboarding,
    getOtherUserData,
    getPersonalUserData,
    searchUsers,
    updateProfileImage,
    updateUserProfile,
} from "../controllers/userController"

const router = Router()

// Middleware to verify token

router.post("/check-email", checkEmailExists)
router.get("/:uid", verifyToken, getPersonalUserData)
router.get("/:uid/other", verifyToken, getOtherUserData)
router.put("/:uid/profile", verifyToken, updateUserProfile);
router.get("/:uid/onboarded", verifyToken, checkOnboardedStatus);
router.post("/:uid/complete-onboarding", verifyToken, completeOnboarding);

//Route to check unique username
router.get("/check-username/:userName", checkUsernameAvailability)
router.get("/:uid/search", verifyToken, searchUsers)
router.put("/:userId/update-profile-image", verifyToken, updateProfileImage);

export { router as userRoutes }
