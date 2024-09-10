// import React, { useState } from "react"
// import { useSearchUsers } from "@/services/userService"
// import { useAuth } from "@/hooks/useAuth"
// import { toast } from "react-toastify"
// import { RxCrossCircled } from "react-icons/rx"
// import { FaSearch } from "react-icons/fa" // Import search icon
// import "../../index.css"

// interface User {
//     _id: string
//     userName: string
//     profile_image: string | null
// }

// // Mock user data
// const usersData: any = []

// const FriendSearch: React.FC = () => {
//     const [searchTerm, setSearchTerm] = useState<string>("")
//     const [selectedFriends, setSelectedFriends] = useState<User[]>([])
//     const { user } = useAuth()
//     const { data: users, isLoading } = useSearchUsers(searchTerm, user?.uid)

//     const handleAddFriend = (user: User) => {
//         const isDuplicate = selectedFriends.some(
//             (friend) => friend._id === user._id
//         )
//         if (isDuplicate) {
//             toast.warn("This user is already in your friends list.")
//         } else {
//             setSelectedFriends([...selectedFriends, user])
//             toast.success("Friend added to your list!")
//             setSearchTerm("")
//         }
//     }

//     const handleRemoveFriend = (userId: string) => {
//         setSelectedFriends(
//             selectedFriends.filter((friend) => friend._id !== userId)
//         )
//         toast.info("Friend removed from your list.")
//     }

//     return (
//         <div className="min-h-screen w-full p-4 bg-main text-white flex flex-col items-center justify-start">
//             <div className="w-full max-w-3xl rounded-2xl p-4   bg-main text-white shadow-2xl">
//                 <h1 className="text-2xl italic font-bold mb-4 text-center font-Montserrat">
//                     Stay Connected, Anytime, Anywhere.
//                 </h1>
//                 <div className="mb-6 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FaSearch className="text-gray-400" />
//                     </div>
//                     <input
//                         type="text"
//                         className="w-full pl-10 pr-10 py-2 rounded-2xl focus:outline-none focus:ring bg-white bg-opacity-10 text-white"
//                         placeholder="Search users"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     {isLoading && searchTerm.length > 3 && (
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                         </div>
//                     )}
//                 </div>
//                 {isLoading && searchTerm.length > 3 ? (
//                     <p className="text-center text-gray-500">Loading...</p>
//                 ) : (
//                     <ul className="max-h-[300px] overflow-y-auto bg-white bg-opacity-10 rounded-lg shadow-lg mb-6">
//                         {searchTerm.length > 3 &&
//                             users?.slice(0, 10).map((user: User) => (
//                                 <li
//                                     key={user._id}
//                                     className="flex justify-between items-center p-3  cursor-pointer border-b border-white border-opacity-20"
//                                 >
//                                     <div className="flex items-center space-x-4">
//                                         {user.profile_image && (
//                                             <img
//                                                 src={user.profile_image}
//                                                 alt={user.userName}
//                                                 className="w-12 h-12 object-cover rounded-full"
//                                             />
//                                         )}
//                                         <span>{user.userName}</span>
//                                     </div>
//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary btn-sm"
//                                         onClick={() => handleAddFriend(user)}
//                                     >
//                                         Add
//                                     </button>
//                                 </li>
//                             ))}
//                     </ul>
//                 )}
//                 {selectedFriends.length > 0 && (
//                     <div className="mb-4">
//                         <h3 className="text-xl font-semibold mb-2">
//                             Your Friends:
//                         </h3>
//                         <ul className="space-y-4 max-h-[300px] overflow-y-auto">
//                             {selectedFriends.map((friend) => (
//                                 <li
//                                     key={friend._id}
//                                     className="flex items-center space-x-4 bg-white bg-opacity-10 p-3 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-colors"
//                                 >
//                                     {friend.profile_image && (
//                                         <img
//                                             src={friend.profile_image}
//                                             alt={friend.userName}
//                                             className="w-12 h-12 object-cover rounded-full"
//                                         />
//                                     )}
//                                     <span className="flex-grow">
//                                         {friend.userName}
//                                     </span>
//                                     <button
//                                         type="button"
//                                         onClick={() =>
//                                             handleRemoveFriend(friend._id)
//                                         }
//                                         className="text-red-500 hover:text-red-700"
//                                     >
//                                         <RxCrossCircled size="24px" />
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default FriendSearch

// Compare this snippet from client/src/components/ui/button.tsx:

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { useSearchUsers } from "@/services/userService"
// import { Button, Input, Avatar } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { z } from "zod"
import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/services/friendsService"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const searchSchema = z
    .string()
    .min(3, "Search term must be at least 3 characters long")

const FriendsSearch: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "add">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const { user } = useAuth()

    const {
        useGetFriends,
        useSendFriendRequest,
        useRespondToFriendRequest,
        useRemoveFriend,
        useGetPendingRequests,
    } = useFriends()

    const { data: friends, isLoading: isLoadingFriends } = useGetFriends()
    const { data: pendingRequests, isLoading: isLoadingRequests } =
        useGetPendingRequests()
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

    const handleSendRequest = (userId: string) => {
        sendFriendRequestMutation.mutate(userId, {
            onSuccess: () => {
                toast.success("Friend request sent successfully.")
            },
            onError: (error) => {
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

    const handleRemoveFriend = (friendId: string) => {
        removeFriendMutation.mutate(friendId, {
            onSuccess: () => {
                toast.success("Friend removed successfully.")
            },
            onError: (error) => {
                toast.error("Failed to remove friend. Please try again.")
            },
        })
    }

    return (
        <div className="container mx-auto p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="mb-4">
                        {activeTab === "all"
                            ? "All Friends"
                            : activeTab === "pending"
                              ? "Pending Requests"
                              : "Add Friend"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("all")}>
                        All Friends
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("pending")}>
                        Pending Requests
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("add")}>
                        Add Friend
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AnimatePresence mode="wait">
                {activeTab === "all" && (
                    <motion.div
                        key="all-friends"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">All Friends</h2>
                        {isLoadingFriends ? (
                            <p>Loading friends...</p>
                        ) : (
                            <ul className="space-y-4">
                                {friends.map((friend: any) => (
                                    <motion.li
                                        key={friend._id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center">
                                            {/* <Avatar
                                                src={friend.profile_image}
                                                alt={friend.userName}
                                            /> */}
                                            <Avatar>
                                                <AvatarImage
                                                    src={friend.profile_image}
                                                    alt={friend.userName}
                                                />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="ml-4 font-semibold">
                                                {friend.userName}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handleRemoveFriend(friend._id)
                                            }
                                            variant="destructive"
                                        >
                                            Remove
                                        </Button>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}

                {activeTab === "pending" && (
                    <motion.div
                        key="pending-requests"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            Pending Requests
                        </h2>
                        {isLoadingRequests ? (
                            <p>Loading requests...</p>
                        ) : (
                            <ul className="space-y-4">
                                {pendingRequests.map((request: any) => (
                                    <motion.li
                                        key={request._id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <span className="font-semibold">
                                            {request.from}
                                        </span>
                                        <div className="space-x-2">
                                            <Button
                                                onClick={() =>
                                                    handleRespondToRequest(
                                                        request._id,
                                                        "accept"
                                                    )
                                                }
                                                variant="default"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleRespondToRequest(
                                                        request._id,
                                                        "reject"
                                                    )
                                                }
                                                variant="outline"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}

                {activeTab === "add" && (
                    <motion.div
                        key="add-friend"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Add Friend</h2>
                        <div className="flex space-x-2 mb-4">
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Search</Button>
                        </div>
                        {isLoadingSearch ? (
                            <p>Searching...</p>
                        ) : (
                            <ul className="space-y-4">
                                {searchResults?.map((user: any) => (
                                    <motion.li
                                        key={user._id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center">
                                            {/* <Avatar
                                                src={user.profile_image}
                                                alt={user.userName}
                                            /> */}
                                            <Avatar>
                                                <AvatarImage
                                                    src={user.profile_image}
                                                    alt={user.userName}
                                                />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="ml-4 font-semibold">
                                                {user.userName}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handleSendRequest(user._id)
                                            }
                                        >
                                            Send Request
                                        </Button>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FriendsSearch
