import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import { getFriendJournalEntries } from "../../controllers/journal/getFriendJournalEntries"

const router = Router()
router.get("/entries/:userName", verifyToken, getFriendJournalEntries)
export default router
