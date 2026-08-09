import { type Request, type Response } from "express"
import User from "../models/User"
import mongoose from "mongoose"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../lib/auth"

/**
 * @param req
 * @param res
 * Note: Check if the username is available when input.
 */
export const checkUsernameAvailability = async (
    req: Request,
    res: Response
) => {
    try {
        const userName = req.params.userName as string

        const existingUser = await User.findOne({
            userName: userName.toLowerCase(),
        })

        res.json({ isAvailable: !existingUser })
    } catch (error) {
        console.error("Error checking username availability:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

/**
 * @param req
 * @param res
 * Note: Check if the email exists.
 */
export const checkEmailExists = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(200).json({ exists: true })
        } else {
            return res.status(200).json({ exists: false })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

/**
 *
 * @param req
 * @param res
 * Note: search user based on the query parameters.
 */
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const { term } = req.query

        // Verify the user
        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        if (!term || typeof term !== "string") {
            return res.status(400).json({ error: "Invalid search term" })
        }
        console.log("term is : ", term)

        const users = await User.find({
            userName: { $regex: term, $options: "i" },
            _id: { $ne: uid }, // Exclude the current user from search results
            onboarded: true,
        }).select("_id userName profile_image")

        console.log("backend users : ", users)
        res.json(users)
    } catch (error) {
        console.error("Error searching users:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getPersonalUserData = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params

        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(user)
    } catch (error) {
        console.error("Error fetching user data:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getOtherUserData = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(user)
    } catch (error) {
        console.error("Error fetching user data:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        console.log("I am on")

        const { uid } = req.params
        const updateData = req.body

        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, updateData, {
            new: true,
        })
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const checkOnboardedStatus = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params

        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({ onboarded: user.onboarded })
    } catch (error) {
        console.error("Error checking onboarded status:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const completeOnboarding = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const { username, profile_image, topMovies, directors, friends } =
            req.body
        if (req.user?.uid !== uid) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // Update the existing top 5 movies list
        const top5MoviesList = user.lists.find(
            (list) => list.name === "Top 5 Movies"
        )
        if (top5MoviesList) {
            top5MoviesList.movies = topMovies.map((movie: any) => ({
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
            }))
        }

        // Replace fake directors list with user's chosen directors

        user.profile_image = profile_image

        user.onboarded = true

        // Add "Onboarded" badge
        if (!user.badges.includes("Onboarded")) {
            user.badges.push("Onboarded")
        }

        await user.save()

        res.json({
            message: "Onboarding completed successfully",
            user: user,
        })
    } catch (error: unknown) {
        console.error("Error completing onboarding:", error)
        if (error instanceof Error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            })
        } else {
            res.status(500).json({
                error: "Internal server error",
                details: "An unknown error occurred",
            })
        }
    }
}

export const updateProfileImage = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const userIdFromToken = req.user?.uid

        if (!userIdFromToken || userIdFromToken !== userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { profileImage } = req.body

        if (!profileImage) {
            return res
                .status(400)
                .json({ error: "Profile image URL is required" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile_image: profileImage },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({
            message: "Profile image updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error updating profile image:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, age, username } = req.body

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            return res.status(401).json({ error: "No token provided" })
        }

        const uid = session.user.id

        if (email && session.user.email && email !== session.user.email) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        const resolvedEmail = session.user.email || email

        const existingUser = await User.findOne({
            $or: [{ email: resolvedEmail }, { _id: uid }],
        })
        if (existingUser) {
            return res.status(400).json({ error: "email is already in use." })
        }

        // Create fake top 5 movies list
        const fakeTop5MoviesList = {
            list_id: new mongoose.Types.ObjectId().toString(),
            name: "Top 5 Movies",
            list_type: "user" as const,
            movies: [
                {
                    movie_id: "tt0111161",
                    title: "The Shawshank Redemption",
                    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                    release_date: "1994-09-23",
                    genre_ids: [18, 80],
                },
                {
                    movie_id: "tt0068646",
                    title: "The Godfather",
                    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    release_date: "1972-03-14",
                    genre_ids: [18, 80],
                },
                {
                    movie_id: "tt0071562",
                    title: "The Godfather Part II",
                    poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
                    release_date: "1974-12-20",
                    genre_ids: [18, 80],
                },
                {
                    movie_id: "tt0468569",
                    title: "The Dark Knight",
                    poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
                    release_date: "2008-07-16",
                    genre_ids: [18, 28, 80, 53],
                },
                {
                    movie_id: "tt0050083",
                    title: "12 Angry Men",
                    poster_path: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
                    release_date: "1957-04-10",
                    genre_ids: [18],
                },
            ],
            members: [{ user_id: uid, is_author: true }],
            date_created: new Date(),
            description: "My Top 5 Movies",
            isPublic: true,
        }

        // Create fake directors list
        const fakeDirectorsList = {
            directors_id: new mongoose.Types.ObjectId().toString(),
            names: [
                {
                    id: "525",
                    name: "Christopher Nolan",
                    profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
                    known_for_department: "Directing",
                },
                {
                    id: "1032",
                    name: "Martin Scorsese",
                    profile_path: "/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg",
                    known_for_department: "Directing",
                },
                {
                    id: "578",
                    name: "Steven Spielberg",
                    profile_path: "/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg",
                    known_for_department: "Directing",
                },
            ],
        }

        // Create new user with fake data
        const newUser = new User({
            _id: uid,
            userName: username,
            email: resolvedEmail,
            age,
            groups: [],
            groupIds: [],
            badges: ["New User"],
            lists: [fakeTop5MoviesList],
            actor: [],
            journal: [],
            directorsold: [fakeDirectorsList],
            profile_image: "https://example.com/default-profile-image.jpg",
            onboarded: false,
            friends: [],
            friendRequests: [],
        })

        await newUser.save()
        res.status(201).json({
            message: "User created successfully with initial data",
        })
    } catch (error) {
        console.error("Failed to create user:", error)
        res.status(500).json({ error: "Failed to create user" })
    }
}
