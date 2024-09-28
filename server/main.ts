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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()

connectDatabase()
console.log("console log ho bhi rha h ya nhi ?")
app.use(cors())
app.use(express.json())

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

// try {
//     console.log("hello")

//     const serviceAccount = JSON.parse(
//         fs.readFileSync(path.join(__dirname, "firebases.json"), "utf8")
//     )

//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     })
//     console.log("Firebase Admin SDK initialized successfully")
// } catch (error) {
//     console.error("Error initializing Firebase Admin SDK:", error)
// }
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

// Route to create a new user
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

        // Create new user
        const newUser = new User({
            _id: uid,
            userName: username,
            email,
            age,
            groups: [],
            badges: [],
            lists: [],
            actor: [],
            journal: [],
            directorsold: [],
            profile_image: "",
        })
        await newUser.save()

        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.error("Failed to create user:", error)
        res.status(500).json({ error: "Failed to create user" })
    }
})

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
