import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { useSearchUsers } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { z } from "zod"
import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/services/friendsService"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import {
    UserPlus,
    Trash,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Search,
    ListFilter,
    Film,
    Music2,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

const searchSchema = z
    .string()
    .min(3, "Search term must be at least 3 characters long")

type FriendsTab = "online" | "all" | "pending" | "blocked"

const ACTIVITY_STATUSES = [
    { label: "Watching 'Blade Runner 2049'", icon: "film" as const },
    { label: "Listening to 'Synthwave Mix'", icon: "music" as const },
    { label: "Online", icon: null },
    { label: "In menus", icon: null },
]

function activityFor(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % ACTIVITY_STATUSES.length
    return ACTIVITY_STATUSES[hash]
}

const FriendsSearch: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FriendsTab>("online")
    const [listFilter, setListFilter] = useState("")
    const [addSearchTerm, setAddSearchTerm] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
    const [friendToRemove, setFriendToRemove] = useState("")
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        totalPages: 1,
    })
    const { user } = useAuth()
    const navigate = useNavigate()

    const {
        useGetFriends,
        useSendFriendRequest,
        useRespondToFriendRequest,
        useRemoveFriend,
        useGetPendingRequests,
    } = useFriends()

    const [friendRequestStatus, setFriendRequestStatus] = useState<{
        [key: string]: { loading: boolean; sent: boolean }
    }>({})
    const [requestLoading, setRequestLoading] = useState<{
        [key: string]: { accept: boolean; reject: boolean }
    }>({})
    const [removeLoading, setRemoveLoading] = useState(false)

    const {
        data: friends,
        isLoading: isLoadingFriends,
        refetch: refetchFriends,
    } = useGetFriends({ page: pagination.page, limit: pagination.limit })

    const {
        data: pendingRequestsRaw,
        isLoading: isLoadingRequests,
        refetch: refetchPendingRequests,
    } = useGetPendingRequests({ page: pagination.page, limit: pagination.limit })

    const pendingRequests = Array.isArray(pendingRequestsRaw?.pendingRequests)
        ? pendingRequestsRaw.pendingRequests
        : Array.isArray(pendingRequestsRaw)
          ? pendingRequestsRaw
          : []

    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        refetch: refetchSearch,
    } = useSearchUsers(addSearchTerm, user?.uid)

    const sendFriendRequestMutation = useSendFriendRequest()
    const respondToFriendRequestMutation = useRespondToFriendRequest()
    const removeFriendMutation = useRemoveFriend()

    const friendList: string[] = friends?.friends ?? []

    const filteredFriends = useMemo(() => {
        const q = listFilter.trim().toLowerCase()
        if (!q) return friendList
        return friendList.filter((f) => f.toLowerCase().includes(q))
    }, [friendList, listFilter])

    useEffect(() => {
        if (activeTab === "pending") {
            refetchPendingRequests()
        } else if (activeTab === "online" || activeTab === "all") {
            refetchFriends()
        }
    }, [pagination.page, pagination.limit, activeTab])

    useEffect(() => {
        if (friends?.meta?.[0]?.totalPages) {
            setPagination((prev) => ({
                ...prev,
                totalPages: friends.meta[0].totalPages,
            }))
        }
    }, [friends])

    const handleAddSearch = () => {
        try {
            searchSchema.parse(addSearchTerm)
            refetchSearch()
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.issues[0].message)
            }
        }
    }

    const handleSendRequest = (friendUserName: string) => {
        if (friendRequestStatus[friendUserName]?.sent) return

        setFriendRequestStatus((prev) => ({
            ...prev,
            [friendUserName]: { loading: true, sent: false },
        }))

        sendFriendRequestMutation.mutate(friendUserName, {
            onSuccess: () => {
                setFriendRequestStatus((prev) => ({
                    ...prev,
                    [friendUserName]: { loading: false, sent: true },
                }))
                toast.success("Friend request sent successfully.")
            },
            onError: (error) => {
                const axiosError = error as AxiosError
                const message: any = axiosError.response?.data
                toast.warn(message?.message ?? "Failed to send request")
                setFriendRequestStatus((prev) => ({
                    ...prev,
                    [friendUserName]: { loading: false, sent: false },
                }))
            },
        })
    }

    const handleRespondToRequest = (
        requestId: string,
        action: "accept" | "reject"
    ) => {
        setRequestLoading((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], [action]: true },
        }))

        respondToFriendRequestMutation.mutate(
            { requestId, action },
            {
                onSuccess: () => {
                    toast.success(`Friend request ${action}ed successfully.`)
                },
                onError: () => {
                    toast.error(
                        `Failed to ${action} friend request. Please try again.`
                    )
                },
                onSettled: () => {
                    setRequestLoading((prev) => ({
                        ...prev,
                        [requestId]: { ...prev[requestId], [action]: false },
                    }))
                },
            }
        )
    }

    const handleRemoveFriend = () => {
        setRemoveLoading(true)
        removeFriendMutation.mutate(friendToRemove, {
            onSuccess: () => {
                toast.success("Friend removed successfully.")
                setIsRemoveDialogOpen(false)
            },
            onError: () => {
                toast.error("Failed to remove friend. Please try again.")
            },
            onSettled: () => {
                setRemoveLoading(false)
            },
        })
    }

    const handleUserClick = (username: string) => {
        navigate(`/user/${username}`)
    }

    const renderFriendRow = (friend: string, showOnlineDot: boolean) => {
        const activity = activityFor(friend)
        return (
            <motion.li
                key={friend}
                className="flex items-center justify-between gap-4 border border-border bg-transparent px-4 py-3.5 rounded-[4px] transition-colors hover:bg-surface/60"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    type="button"
                    className="flex items-center gap-3.5 min-w-0 text-left"
                    onClick={() => handleUserClick(friend)}
                >
                    <div className="relative shrink-0">
                        <Avatar className="h-11 w-11 rounded-[4px]">
                            <AvatarImage
                                src={`/api/avatar/${friend}`}
                                alt={friend}
                                className="rounded-[4px]"
                            />
                            <AvatarFallback className="rounded-[4px] bg-surface text-foreground text-xs font-heading">
                                {friend.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {showOnlineDot && (
                            <span
                                aria-hidden
                                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-electric ring-2 ring-background"
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-foreground truncate">
                            {friend}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 truncate mt-0.5">
                            {activity.icon === "film" && (
                                <Film className="h-3.5 w-3.5 shrink-0" />
                            )}
                            {activity.icon === "music" && (
                                <Music2 className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className="truncate">{activity.label}</span>
                        </p>
                    </div>
                </button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => {
                        setFriendToRemove(friend)
                        setIsRemoveDialogOpen(true)
                    }}
                    aria-label={`Remove ${friend}`}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </motion.li>
        )
    }

    const friendsPagination =
        filteredFriends.length > 0 ? (
            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPagination((prev) => ({
                                    ...prev,
                                    page: prev.page - 1,
                                }))
                            }
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Previous
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPagination((prev) => ({
                                    ...prev,
                                    page: prev.page + 1,
                                }))
                            }
                            disabled={
                                pagination.totalPages === pagination.page
                            }
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        ) : null

    return (
        <div className="min-h-screen max-h-screen overflow-auto scrollbar-hide text-foreground w-full bg-background px-6 md:px-10 lg:px-14 py-10 md:py-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                            Friends
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Manage your network and connections.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="uppercase tracking-wider text-xs h-9 px-4"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Friend
                    </Button>
                </header>

                <Tabs
                    value={activeTab}
                    onValueChange={(v) => {
                        setActiveTab(v as FriendsTab)
                        setListFilter("")
                        setPagination((prev) => ({ ...prev, page: 1 }))
                    }}
                    className="w-full"
                >
                    <TabsList className="w-full justify-start gap-0 h-auto mb-6">
                        <TabsTrigger
                            value="online"
                            className="uppercase tracking-wider text-xs px-4 pb-3"
                        >
                            Online
                        </TabsTrigger>
                        <TabsTrigger
                            value="all"
                            className="uppercase tracking-wider text-xs px-4 pb-3"
                        >
                            All Friends
                        </TabsTrigger>
                        <TabsTrigger
                            value="pending"
                            className="relative uppercase tracking-wider text-xs px-4 pb-3 pr-7"
                        >
                            Pending
                            {pendingRequests.length > 0 && (
                                <span className="absolute top-1.5 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] leading-none font-bold text-white bg-primary rounded-full">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="blocked"
                            className="uppercase tracking-wider text-xs px-4 pb-3"
                        >
                            Blocked
                        </TabsTrigger>
                    </TabsList>

                    {/* Search + Filter (list tabs) */}
                    {(activeTab === "online" ||
                        activeTab === "all" ||
                        activeTab === "blocked") && (
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="Search friends..."
                                    value={listFilter}
                                    onChange={(e) =>
                                        setListFilter(e.target.value)
                                    }
                                    className="pl-10 h-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="uppercase tracking-wider text-xs h-10 shrink-0"
                                onClick={() =>
                                    toast.info(
                                        "Filters coming soon — use search for now."
                                    )
                                }
                            >
                                <ListFilter className="h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <TabsContent value="online" className="mt-0">
                            <motion.div
                                key="online"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoadingFriends ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        Loading friends...
                                    </p>
                                ) : filteredFriends.length === 0 ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        No friends online.
                                    </p>
                                ) : (
                                    <>
                                        <ul className="space-y-3">
                                            {filteredFriends.map((friend) =>
                                                renderFriendRow(friend, true)
                                            )}
                                        </ul>
                                        {friendsPagination}
                                    </>
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="all" className="mt-0">
                            <motion.div
                                key="all"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoadingFriends ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        Loading friends...
                                    </p>
                                ) : filteredFriends.length === 0 ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        No friends yet. Add someone to get
                                        started.
                                    </p>
                                ) : (
                                    <>
                                        <ul className="space-y-3">
                                            {filteredFriends.map((friend) =>
                                                renderFriendRow(friend, true)
                                            )}
                                        </ul>
                                        {friendsPagination}
                                    </>
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="pending" className="mt-0">
                            <motion.div
                                key="pending"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoadingRequests ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        Loading requests...
                                    </p>
                                ) : pendingRequests.length === 0 ? (
                                    <p className="text-muted-foreground text-sm py-8">
                                        No pending friend requests.
                                    </p>
                                ) : (
                                    <ul className="space-y-3">
                                        {pendingRequests.map((request: any) => (
                                            <motion.li
                                                key={request._id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border px-4 py-3.5 rounded-[4px]"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <Avatar className="h-11 w-11 rounded-[4px]">
                                                        <AvatarImage
                                                            src={`/api/avatar/${request.from}`}
                                                            alt={request.from}
                                                            className="rounded-[4px]"
                                                        />
                                                        <AvatarFallback className="rounded-[4px] bg-surface text-xs font-heading">
                                                            {request.from
                                                                .substring(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-heading font-semibold">
                                                            {request.from}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Incoming request
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 sm:flex-none"
                                                        onClick={() =>
                                                            handleRespondToRequest(
                                                                request._id,
                                                                "accept"
                                                            )
                                                        }
                                                        disabled={
                                                            requestLoading[
                                                                request._id
                                                            ]?.accept
                                                        }
                                                    >
                                                        {requestLoading[
                                                            request._id
                                                        ]?.accept
                                                            ? "Accepting..."
                                                            : "Accept"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 sm:flex-none"
                                                        onClick={() =>
                                                            handleRespondToRequest(
                                                                request._id,
                                                                "reject"
                                                            )
                                                        }
                                                        disabled={
                                                            requestLoading[
                                                                request._id
                                                            ]?.reject
                                                        }
                                                    >
                                                        {requestLoading[
                                                            request._id
                                                        ]?.reject
                                                            ? "Rejecting..."
                                                            : "Reject"}
                                                    </Button>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="blocked" className="mt-0">
                            <motion.div
                                key="blocked"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-muted-foreground text-sm py-8">
                                    No blocked users.
                                </p>
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>

            {/* Add Friend dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl">
                            Add Friend
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={addSearchTerm}
                                onChange={(e) =>
                                    setAddSearchTerm(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddSearch()
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleAddSearch}>Search</Button>
                    </div>
                    <div className="max-h-72 overflow-auto scrollbar-hide space-y-2 mt-2">
                        {isLoadingSearch ? (
                            <p className="text-sm text-muted-foreground py-4">
                                Searching...
                            </p>
                        ) : (
                            searchResults?.map((u: any) => (
                                <div
                                    key={u.uid}
                                    className={cn(
                                        "flex items-center justify-between gap-3 border border-border rounded-[4px] px-3 py-2.5"
                                    )}
                                >
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 min-w-0 text-left"
                                        onClick={() =>
                                            handleUserClick(u.userName)
                                        }
                                    >
                                        <Avatar className="h-9 w-9 rounded-[4px]">
                                            <AvatarImage
                                                src={`/api/avatar/${u.userName}`}
                                                alt={u.userName}
                                                className="rounded-[4px]"
                                            />
                                            <AvatarFallback className="rounded-[4px] text-xs">
                                                {u.userName
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-heading font-semibold text-sm truncate">
                                            {u.userName}
                                        </span>
                                    </button>
                                    <Button
                                        size="sm"
                                        disabled={
                                            friendRequestStatus[u.userName]
                                                ?.loading ||
                                            friendRequestStatus[u.userName]?.sent
                                        }
                                        onClick={() =>
                                            handleSendRequest(u.userName)
                                        }
                                    >
                                        {friendRequestStatus[u.userName]?.loading
                                            ? "Sending..."
                                            : friendRequestStatus[u.userName]
                                                    ?.sent
                                              ? "Sent"
                                              : "Add"}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Remove confirm */}
            <Dialog
                open={isRemoveDialogOpen}
                onOpenChange={setIsRemoveDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-heading">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            Remove Friend
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground text-sm">
                        Are you sure you want to remove{" "}
                        <span className="text-foreground font-medium">
                            {friendToRemove}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRemoveDialogOpen(false)}
                            disabled={removeLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveFriend}
                            disabled={removeLoading}
                        >
                            {removeLoading ? "Removing..." : "Remove Friend"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FriendsSearch
