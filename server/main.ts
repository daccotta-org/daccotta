import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import admin from "firebase-admin"
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

app.use("/api/user", userRoutes)
app.use("/api/group", groupRoutes)
app.use("/api/list", listRoutes)
app.use("/api/friends", friendRoutes)
app.use("/api/journal", journalRoutes)

app.get("/api/hello", (req, res) => {
    res.send("Hello World!")
})

app.get("/ping", (req, res) => {
    res.send("Server is alive")
})
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}! ⁠`)
    keepAlive()
})
