import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken"
import getMyGroups from "./getMyGroups"
import createGroup from "./createGroup"
import getGroup from "./getGroup"
import updateGroup from "./updateGroup"
import deleteGroup from "./deleteGroup"
import addMember from "./addMember"
import removeMember from "./removeMember"
import updateMemberRole from "./updateMemberRole"
import getGroupLists from "./getGroupLists"
import createGroupList from "./createGroupList"
import getGroupList from "./getGroupList"
import deleteGroupList from "./deleteGroupList"
import addMovieToGroupList from "./addMovieToGroupList"
import removeMovieFromGroupList from "./removeMovieFromGroupList"
import getGroupActivity from "./getGroupActivity"
import getGroupStats from "./getGroupStats"
import getGroupRecommendations from "./getGroupRecommendations"

const router = Router()

router.use(verifyToken)

router.use(getMyGroups)
router.use(createGroup)
router.use(getGroup)
router.use(updateGroup)
router.use(deleteGroup)
router.use(addMember)
router.use(removeMember)
router.use(updateMemberRole)
router.use(getGroupLists)
router.use(createGroupList)
router.use(getGroupList)
router.use(deleteGroupList)
router.use(addMovieToGroupList)
router.use(removeMovieFromGroupList)
router.use(getGroupActivity)
router.use(getGroupStats)
router.use(getGroupRecommendations)

export { router as groupRoutes }
