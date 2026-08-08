import { MongoClient, type Db } from "mongodb"
import "dotenv/config"

const uri = process.env.MONGO_URL

if (!uri) {
    throw new Error("MONGO_URL is not defined")
}

const client = new MongoClient(uri)
let db: Db | null = null

export async function getAuthDb(): Promise<Db> {
    if (!db) {
        await client.connect()
        db = client.db()
        console.log("MongoDB (native) connected for better-auth")
    }
    return db
}

export { client }
