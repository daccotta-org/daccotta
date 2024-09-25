

import React, { useState } from "react"
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
import { MessageCircle, MoreVertical, Users, Trash, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

const searchSchema = z
    .string()
    .min(3, "Search term must be at least 3 characters long")

const FriendsSearch: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "add">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
    const [friendToRemove, setFriendToRemove] = useState("")
    const { user } = useAuth()
    const navigate = useNavigate()

    const {
        useGetFriends,
        useSendFriendRequest,
        useRespondToFriendRequest,
        useRemoveFriend,
        useGetPendingRequests,
    } = useFriends()

    const { data: friends, isLoading: isLoadingFriends } = useGetFriends()
    const { data: pendingRequests } = useGetPendingRequests()
        useGetPendingRequests();

    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        refetch: refetchSearch,
    } = useSearchUsers(searchTerm, user?.uid)

    const sendFriendRequestMutation = useSendFriendRequest()
    const respondToFriendRequestMutation = useRespondToFriendRequest()
    const removeFriendMutation = useRemoveFriend()

    const handleSearch = () => {
        try {
            searchSchema.parse(searchTerm)
            refetchSearch()
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message)
            }
        }
    }

    const handleSendRequest = (friendUserName: string) => {
        sendFriendRequestMutation.mutate(friendUserName, {
            onSuccess: () => {
                toast.success("Friend request sent successfully.")
            },
            onError: (error) => {
                const axiosError = error as AxiosError
                const message: any = axiosError.response?.data
                if (message.message === "Friend request already sent") {
                    toast.warn("Friend request already sent.")
                    return
                }

                toast.error("Failed to send friend request. Please try again.")
            },
        })
    }

    const handleRespondToRequest = (
        requestId: string,
        action: "accept" | "reject"
    ) => {
        respondToFriendRequestMutation.mutate(
            { requestId, action },
            {
                onSuccess: () => {
                    toast.success(`Friend request ${action}ed successfully.`)
                },

                onError: (error) => {
                    toast.error(
                        `Failed to ${action} friend request. Please try again.`
                    )
                },
            }
        )
    }

    const handleRemoveFriend = () => {
        removeFriendMutation.mutate(friendToRemove, {
            onSuccess: () => {
                toast.success("Friend removed successfully.")
                setIsRemoveDialogOpen(false)
            },
            onError: (error) => {
                toast.error("Failed to remove friend. Please try again.")
            },
        })
    }

    const handleUserClick = (username: string) => {
        console.log(username)
        navigate(`/user/${username}`)
    }

    return (
        <div className="min-h-screen pt-[5rem] md:pt[5rem] lg:pt-[5rem] max-h-screen overflow-auto scrollbar-hide text-gray-100 lg:p-4 px-[4rem] w-full">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Friends</h1>
                    </div>
                    <nav className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="ghost"
                            className={`text-gray-300 hover:text-white hover:bg-gray-800 ${activeTab === "all" ? "bg-gray-800" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All
                        </Button>
                        <Button
                            variant="ghost"
                            className={`text-gray-300 hover:text-white hover:bg-gray-800 ${activeTab === "pending" ? "bg-gray-800" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Pending
                        </Button>
                        <Button
                            className={`bg-green-600 hover:bg-green-700 ${activeTab === "add" ? "bg-green-700" : ""}`}
                            onClick={() => setActiveTab("add")}
                        >
                            Add Friend
                        </Button>
                    </nav>
                </header>
                <AnimatePresence mode="wait">
                    {activeTab === "all" && (
                        <motion.section
                            key="all-friends"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-lg font-semibold mb-4">
                                ALL FRIENDS — {friends?.length || 0}
                            </h2>
                            {isLoadingFriends ? (
                                <p>Loading friends...</p>
                            ) : (
                                <ul className="space-y-4">
                                    {friends.map((friend: string) => (
                                        <motion.li
                                            key={friend}
                                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg overflow-hidden cursor-pointer transition-colors hover:bg-gray-700"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div
                                                className="flex items-center gap-3 button cursor-pointer"
                                                onClick={() =>
                                                    handleUserClick(friend)
                                                }
                                            >
                                                <Avatar>
                                                    <AvatarImage
                                                        src={`/api/avatar/${friend}`}
                                                        alt={friend}
                                                    />
                                                    <AvatarFallback>
                                                        {friend
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {friend}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        Online
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    onClick={() => {
                                                        setFriendToRemove(friend)
                                                        setIsRemoveDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}

                    {/* ... (pending and add sections remain unchanged) ... */}

                </AnimatePresence>
            </div>

            <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-white" />
                            Remove Friend
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to remove this friend? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button className="bg-white text-black" onClick={() => setIsRemoveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button  onClick={handleRemoveFriend}>
                            Remove Friend
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FriendsSearch