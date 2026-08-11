import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getJournalEntries } from "../../controllers/journal/getJournalEntries"

const router = Router()
router.get("/entries", verifyToken, getJournalEntries)
export default router
