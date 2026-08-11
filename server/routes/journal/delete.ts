import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { deleteJournalEntry } from "../../controllers/journal/deleteJournalEntry"

const router = Router()
router.delete("/delete/:entryId", verifyToken, deleteJournalEntry)
export default router
