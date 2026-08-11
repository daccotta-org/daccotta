import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { addJournalEntry } from "../../controllers/journal/addJournalEntry"

const router = Router()
router.post("/add", verifyToken, addJournalEntry)
export default router
