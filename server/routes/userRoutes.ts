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
router.put("/:userId/update-profile-image", verifyToken, async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userIdFromToken = req.user?.uid;

        if (!userIdFromToken || userIdFromToken !== userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { profileImage } = req.body;

        if (!profileImage) {
            return res.status(400).json({ error: "Profile image URL is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile_image: profileImage },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Profile image updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export { router as userRoutes }
