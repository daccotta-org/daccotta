import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {
    initializeApp,
    cert,
    type ServiceAccount,
} from "firebase-admin/app"
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

function loadFirebaseServiceAccount(): ServiceAccount {
    // Railway / production: prefer env var with the full service-account JSON
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            console.log(
                "Firebase configuration loaded from FIREBASE_SERVICE_ACCOUNT"
            )
            return account
        } catch (error) {
            console.error(
                "Error parsing FIREBASE_SERVICE_ACCOUNT env var:",
                error
            )
            process.exit(1)
        }
    }

    // Local development: server/firebases.json
    if (process.env.NODE_ENV === "development") {
        try {
            const account = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "firebases.json"),
                    "utf8"
                )
            )
            console.log("Firebase configuration loaded from local file")
            return account
        } catch (error) {
            console.error("Error reading local firebases.json:", error)
            process.exit(1)
        }
    }

    // Render-style secret mount fallback
    const secretPath = "/etc/secrets/firebases.json"
    try {
        const account = JSON.parse(fs.readFileSync(secretPath, "utf8"))
        console.log("Firebase configuration loaded from secret file")
        return account
    } catch (error) {
        console.error(
            "Error reading Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT, use firebases.json in development, or mount /etc/secrets/firebases.json:",
            error
        )
        process.exit(1)
    }

    // Unreachable — satisfies TypeScript after process.exit
    throw new Error("Firebase credentials not configured")
}

const serviceAccount = loadFirebaseServiceAccount()

try {
    console.log("Initializing Firebase Admin SDK")
    initializeApp({
        credential: cert(serviceAccount),
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

app.get("/api/hello", (_req, res) => {
    res.send("Hello World!")
})

app.get("/ping", (_req, res) => {
    res.send("Server is alive")
})
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}! ⁠`)
    keepAlive()
})
