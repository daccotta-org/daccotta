import { type Request, type Response, Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import {
    addJournalEntry,
    getJournalEntries,
    updateJournalEntry,
    deleteJournalEntry,
    getFriendJournalEntries,
} from "../controllers/journalController"

const router = Router()

console.log("I am here in journalRoutes")

router.post("/add", verifyToken, addJournalEntry)

router.get("/entries", verifyToken, getJournalEntries)
router.get("/entries/:userName", verifyToken, getFriendJournalEntries)

router.put("/update/:entryId", verifyToken, updateJournalEntry)

router.delete("/delete/:entryId", verifyToken, deleteJournalEntry)

export { router as journalRoutes }
