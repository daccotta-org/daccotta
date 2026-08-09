import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import { validate } from "../middleware/validate"
import {
    addMemberSchema,
    addMovieSchema,
    createGroupListSchema,
    createGroupSchema,
    groupIdParams,
    groupListMovieParams,
    groupListParams,
    groupMemberParams,
    paginationQuery,
    updateGroupSchema,
    updateMemberRoleSchema,
} from "../validation/groupSchemas"
import {
    addMember,
    addMovieToGroupList,
    createGroup,
    createGroupList,
    deleteGroup,
    deleteGroupList,
    getGroup,
    getGroupActivity,
    getGroupList,
    getGroupLists,
    getGroupRecommendations,
    getGroupStats,
    getMyGroups,
    removeMember,
    removeMovieFromGroupList,
    updateGroup,
    updateMemberRole,
} from "../controllers/groupControllers/groupController"

const router = Router()

router.use(verifyToken)

router.get("/", getMyGroups)
router.post("/", validate({ body: createGroupSchema }), createGroup)

router.get(
    "/:groupId",
    validate({ params: groupIdParams }),
    getGroup
)
router.patch(
    "/:groupId",
    validate({ params: groupIdParams, body: updateGroupSchema }),
    updateGroup
)
router.delete(
    "/:groupId",
    validate({ params: groupIdParams }),
    deleteGroup
)

router.post(
    "/:groupId/members",
    validate({ params: groupIdParams, body: addMemberSchema }),
    addMember
)
router.delete(
    "/:groupId/members/:userId",
    validate({ params: groupMemberParams }),
    removeMember
)
router.patch(
    "/:groupId/members/:userId",
    validate({ params: groupMemberParams, body: updateMemberRoleSchema }),
    updateMemberRole
)

router.get(
    "/:groupId/lists",
    validate({ params: groupIdParams }),
    getGroupLists
)
router.post(
    "/:groupId/lists",
    validate({ params: groupIdParams, body: createGroupListSchema }),
    createGroupList
)
router.get(
    "/:groupId/lists/:listId",
    validate({ params: groupListParams }),
    getGroupList
)
router.delete(
    "/:groupId/lists/:listId",
    validate({ params: groupListParams }),
    deleteGroupList
)
router.post(
    "/:groupId/lists/:listId/movies",
    validate({ params: groupListParams, body: addMovieSchema }),
    addMovieToGroupList
)
router.delete(
    "/:groupId/lists/:listId/movies/:movieId",
    validate({ params: groupListMovieParams }),
    removeMovieFromGroupList
)

router.get(
    "/:groupId/activity",
    validate({ params: groupIdParams, query: paginationQuery }),
    getGroupActivity
)
router.get(
    "/:groupId/stats",
    validate({ params: groupIdParams }),
    getGroupStats
)
router.get(
    "/:groupId/recommendations",
    validate({ params: groupIdParams }),
    getGroupRecommendations
)

export { router as groupRoutes }
