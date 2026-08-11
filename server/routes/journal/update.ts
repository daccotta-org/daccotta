import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { updateJournalEntry } from "../../controllers/journal/updateJournalEntry"

const router = Router()
router.put("/update/:entryId", verifyToken, updateJournalEntry)
export default router
