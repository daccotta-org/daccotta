import { type Request, type Response, type NextFunction, Router } from "express"
import User from "../models/User"
import { verifyToken } from "../middleware/verifyToken"
import {
    checkEmailExists,
    checkOnboardedStatus,
    checkUsernameAvailability,
    completeOnboarding,
    getOtherUserData,
    getPersonalUserData,
    searchUsers,
    updateUserProfile,
} from "../controllers/userController"
import ListModel from "../models/List"
import mongoose from "mongoose"

const router = Router()

// Middleware to verify token

// Route to get user data
router.post("/check-email", checkEmailExists)
// Route to get personal user data
router.get("/:uid", verifyToken, getPersonalUserData)

// Route to get other user data
router.get("/:uid/other", verifyToken, getOtherUserData)

// Route to update user profile
router.put(
    "/:uid/profile",
    verifyToken,
    updateUserProfile
)

// Route to check onboarded status
router.get(
    "/:uid/onboarded",
    verifyToken,
    checkOnboardedStatus
)

router.post(
    "/:uid/complete-onboarding",
    verifyToken,
    completeOnboarding
)

//Route to check unique username
router.get("/check-username/:userName", checkUsernameAvailability)
router.get("/:uid/search", verifyToken, searchUsers)

export { router as userRoutes }
