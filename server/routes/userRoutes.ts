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

// Route to complete onboarding

// router.post(
//     "/:uid/complete-onboarding",
//     verifyToken,
//     async (req: Request, res: Response) => {
//         try {
//             const { uid } = req.params
//             const { username, profile_image, topMovies, directors, friends } =
//                 req.body

//             if (req.user?.uid !== uid) {
//                 return res.status(403).json({ error: "Unauthorized" })
//             }
//             console.log(topMovies)

//             // Create the top 5 movies list object
//             const top5MoviesList = {
//                 name: "Top 5 Movies",
//                 list_type: "user" as const,
//                 movies: topMovies.map((movie: any) => ({
//                     movie_id: movie.id,
//                     title: movie.title,
//                     poster_path: movie.poster_path,
//                     release_date: movie.release_date,
//                     genre_ids: movie.genre_ids,
//                 })),
//                 members: [{ user_id: uid, is_author: true }],
//                 date_created: new Date(),
//                 description: "Top 5 Movies",
//                 isPublic: true,
//                 isShared: false,
//             }

//             const top5DirectorsList = {
//                 names: directors.map((director: any) => ({
//                     id: director.id,
//                     name: director.name,
//                     profile_path: director.profile_path,
//                     known_for_department: director.known_for_department,
//                 })),
//             }

//             const updatedUser = await User.findByIdAndUpdate(
//                 uid,
//                 {
//                     $set: {
//                         userName: username,
//                         profile_image,
//                         // directors,
//                         friends,
//                         onboarded: true,
//                     },
//                     $push: {
//                         lists: top5MoviesList,
//                         directorsold: top5DirectorsList,
//                     }, // Directly push the list object
//                 },
//                 { new: true, runValidators: true }
//             )

//             if (!updatedUser) {
//                 return res.status(404).json({ error: "User not found" })
//             }

//             res.json({
//                 message: "Onboarding completed successfully",
//                 user: updatedUser,
//             })
//         } catch (error: unknown) {
//             console.error("Error completing onboarding:", error)
//             if (error instanceof Error) {
//                 res.status(500).json({
//                     error: "Internal server error",
//                     details: error.message,
//                 })
//             } else {
//                 res.status(500).json({
//                     error: "Internal server error",
//                     details: "An unknown error occurred",
//                 })
//             }
//         }
//     }
// )
router.post(
    "/:uid/complete-onboarding",
    verifyToken,
    completeOnboarding
)

//Route to check unique username
router.get("/check-username/:userName", checkUsernameAvailability)
router.get("/:uid/search", verifyToken, searchUsers)

export { router as userRoutes }
