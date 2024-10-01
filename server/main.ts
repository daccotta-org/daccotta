import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import admin from "firebase-admin"
import User from "./models/User"
import connectDatabase from "./connections/connectToDB"
import { PORT } from "./config"

import { userRoutes } from "./routes/userRoutes"
import { groupRoutes } from "./routes/groupRoutes"
import { listRoutes } from "./routes/listRoutes"

import * as fs from "fs"
import * as path from "path"
import { friendRoutes } from "./routes/friendRoutes"
import { journalRoutes } from "./routes/journalRoutes"
import { fileURLToPath } from "url"
import { keepAlive } from "./utils/keepAlive"
import mongoose from "mongoose"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()

connectDatabase()
console.log("console log ho bhi rha h ya nhi ?")
app.use(cors())
app.use(express.json())

let serviceAccount

if (process.env.NODE_ENV === "development") {
    // Path for the secret file in Render
    try {
        serviceAccount = JSON.parse(
            fs.readFileSync(path.join(__dirname, "firebases.json"), "utf8")
        )
        console.log("Firebase configuration loaded from local file")
    } catch (error) {
        console.error("Error reading local firebases.json:", error)
        process.exit(1)
    }
} else {
    // Local development: use the file from the project directory
    const secretPath = "/etc/secrets/firebases.json"

    try {
        serviceAccount = JSON.parse(fs.readFileSync(secretPath, "utf8"))
        console.log("Firebase configuration loaded from Render secret file")
    } catch (error) {
        console.error("Error reading Render secret file:", error)
        process.exit(1) // Exit the process if we can't read the configuration
    }
}

try {
    console.log("Initializing Firebase Admin SDK")
    admin.initializeApp({
        credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
        ),
    })
    console.log("Firebase Admin SDK initialized successfully")
} catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error)
    process.exit(1)
}

interface CreateUserRequest {
    uid: string
    email: string
    userName: string
    age: number
}
app.post("/api/users", async (req: Request, res: Response) => {
    try {
        const { uid, email, age, username } = req.body
        console.log(uid, email, age, username)
        // Verify the Firebase ID token
        const authHeader = req.headers.authorization
        const idToken = authHeader && authHeader.split("Bearer ")[1]
        if (!idToken) {
            console.log("No token provided")
            return res.status(401).json({ error: "No token provided" })
        }
        console.log("token decode")
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        console.log("decoded token ", decodedToken)
        console.log("user ")
        if (decodedToken.uid !== uid) {
            console.log("Unauthorized")
            return res.status(403).json({ error: "Unauthorized" })
        }
        // Check if username is already taken
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            console.log("email is already in use.")
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
            email,
            age,
            groups: [],
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
})
// Route to create a new user
// app.post("/api/users", async (req: Request, res: Response) => {
//     try {
//         const { uid, email, age, username } = req.body
//         console.log(uid, email, age, username)

//         // Verify the Firebase ID token
//         const authHeader = req.headers.authorization
//         const idToken = authHeader && authHeader.split("Bearer ")[1]

//         if (!idToken) {
//             console.log("No token provided")
//             return res.status(401).json({ error: "No token provided" })
//         }

//         console.log("token decode")
//         const decodedToken = await admin.auth().verifyIdToken(idToken)

//         console.log("decoded token ", decodedToken)

//         console.log("user ")
//         if (decodedToken.uid !== uid) {
//             console.log("Unauthorized")
//             return res.status(403).json({ error: "Unauthorized" })
//         }

//         // Check if username is already taken

//         const existingUser = await User.findOne({ email })
//         if (existingUser) {
//             console.log("email is already in use.")
//             return res.status(400).json({ error: "email is already in use." })
//         }

//         // Create new user
//         const newUser = new User({
//             _id: uid,
//             userName: username,
//             email,
//             age,
//             groups: [],
//             badges: [],
//             lists: [],
//             actor: [],
//             journal: [],
//             directorsold: [],
//             profile_image: "",
//         })
//         await newUser.save()

//         res.status(201).json({ message: "User created successfully" })
//     } catch (error) {
//         console.error("Failed to create user:", error)
//         res.status(500).json({ error: "Failed to create user" })
//     }
// })

app.use("/api/user", userRoutes)
app.use("/api/group", groupRoutes)
app.use("/api/list", listRoutes)
app.use("/api/friends", friendRoutes)
app.use("/api/journal", journalRoutes)

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.get("/ping", (req, res) => {
    res.send("Server is alive")
})
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}! ⁠`)
    keepAlive()
})
