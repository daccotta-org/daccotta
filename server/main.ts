import "dotenv/config"
import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import connectDatabase from "./connections/connectToDB"
import { PORT } from "./config"
import { auth } from "./lib/auth"

import { userRoutes } from "./routes/userRoutes"
import { groupRoutes } from "./routes/groupRoutes"
import { listRoutes } from "./routes/listRoutes"
import { friendRoutes } from "./routes/friendRoutes"
import { journalRoutes } from "./routes/journalRoutes"
import { keepAlive } from "./utils/keepAlive"

const app = express()
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"

connectDatabase()

app.use(
    cors({
        origin: clientUrl,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["set-auth-token"],
        credentials: true,
    })
)

// Better Auth must be mounted before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

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
    console.log(`app listening on port ${PORT}!`)
    keepAlive()
})
