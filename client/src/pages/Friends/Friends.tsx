// import React, { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { toast } from "react-toastify"
// import { useSearchUsers } from "@/services/userService"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { z } from "zod"
// import { useAuth } from "@/hooks/useAuth"
// import { useFriends } from "@/services/friendsService"
// import { useNavigate } from "react-router-dom"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { AxiosError } from "axios"

// const searchSchema = z
//     .string()
//     .min(3, "Search term must be at least 3 characters long")

// const FriendsSearch: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<"all" | "pending" | "add">("all")
//     const [searchTerm, setSearchTerm] = useState("")
//     const { user } = useAuth()
//     const navigate = useNavigate()
//     const handleUserClick = (username: string) => {
//         console.log(username)
//         navigate(`/user/${username}`)
//     }

//     const {
//         useGetFriends,
//         useSendFriendRequest,
//         useRespondToFriendRequest,
//         useRemoveFriend,
//         useGetPendingRequests,
//     } = useFriends()

//     const { data: friends, isLoading: isLoadingFriends } = useGetFriends()
//     const { data: pendingRequests, isLoading: isLoadingRequests } =
//         useGetPendingRequests()
//     const {
//         data: searchResults,
//         isLoading: isLoadingSearch,
//         refetch: refetchSearch,
//     } = useSearchUsers(searchTerm, user?.uid)

//     const sendFriendRequestMutation = useSendFriendRequest()
//     const respondToFriendRequestMutation = useRespondToFriendRequest()
//     const removeFriendMutation = useRemoveFriend()

//     const handleSearch = () => {
//         try {
//             searchSchema.parse(searchTerm)
//             refetchSearch()
//         } catch (error) {
//             if (error instanceof z.ZodError) {
//                 toast.error(error.errors[0].message)
//             }
//         }
//     }

//     const handleSendRequest = (friendUserName: string) => {
//         sendFriendRequestMutation.mutate(friendUserName, {
//             onSuccess: () => {
//                 toast.success("Friend request sent successfully.")
//             },
//             onError: (error) => {
//                 // toast.error("Failed to send friend request. Please try again.")

//                 const axiosError = error as AxiosError
//                 const message: any = axiosError.response?.data
//                 if (message.message === "Friend request already sent") {
//                     toast.warn("Friend request already sent.")
//                     return
//                 }

//                 toast.error("Failed to send friend request. Please try again.")
//             },
//         })
//     }

//     const handleRespondToRequest = (
//         requestId: string,
//         action: "accept" | "reject"
//     ) => {
//         respondToFriendRequestMutation.mutate(
//             { requestId, action },
//             {
//                 onSuccess: () => {
//                     toast.success(`Friend request ${action}ed successfully.`)
//                 },

//                 onError: (error) => {
//                     toast.error(
//                         `Failed to ${action} friend request. Please try again.`
//                     )
//                 },
//             }
//         )
//     }

//     const handleRemoveFriend = (friendUserName: string) => {
//         removeFriendMutation.mutate(friendUserName, {
//             onSuccess: () => {
//                 toast.success("Friend removed successfully.")
//             },
//             onError: (error) => {
//                 toast.error("Failed to remove friend. Please try again.")
//             },
//         })
//     }

//     return (
//         <div className="w-full   h-full mx-auto p-4">
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button className="mb-4">
//                         {activeTab === "all"
//                             ? "All Friends"
//                             : activeTab === "pending"
//                               ? "Pending Requests"
//                               : "Add Friend"}
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuLabel>Options</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => setActiveTab("all")}>
//                         All Friends
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setActiveTab("pending")}>
//                         Pending Requests
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setActiveTab("add")}>
//                         Add Friend
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>

//             <AnimatePresence mode="wait">
//                 {activeTab === "all" && (
//                     <motion.div
//                         key="all-friends"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.2 }}
//                         className="text-white"
//                     >
//                         <h2 className="text-2xl  font-bold mb-4">
//                             All Friends
//                         </h2>
//                         {isLoadingFriends ? (
//                             <p>Loading friends...</p>
//                         ) : (
//                             <ul className="space-y-4 text-white">
//                                 {friends.map((friend: string) => (
//                                     <motion.li
//                                         key={friend}
//                                         className="flex items-center justify-between p-4 hover:bg-primary transition-colors  rounded-lg shadow"
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         onClick={() => handleUserClick(friend)}
//                                     >
//                                         <div className="flex items-center">
//                                             <Avatar>
//                                                 <AvatarImage
//                                                     src={`/api/avatar/${friend}`}
//                                                     alt={friend}
//                                                 />
//                                                 <AvatarFallback>
//                                                     {friend
//                                                         .substring(0, 2)
//                                                         .toUpperCase()}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                             <span className="ml-4 font-semibold">
//                                                 {friend}
//                                             </span>
//                                         </div>
//                                         <Button
//                                             onClick={() =>
//                                                 handleRemoveFriend(friend)
//                                             }
//                                             variant="destructive"
//                                         >
//                                             Remove
//                                         </Button>
//                                     </motion.li>
//                                 ))}
//                             </ul>
//                         )}
//                     </motion.div>
//                 )}

//                 {activeTab === "pending" && (
//                     <motion.div
//                         key="pending-requests"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.2 }}
//                         className="text-white"
//                     >
//                         <h2 className="text-2xl font-bold mb-4">
//                             Pending Requests
//                         </h2>
//                         {isLoadingRequests ? (
//                             <p>Loading requests...</p>
//                         ) : (
//                             <ul className="space-y-4">
//                                 {pendingRequests.map((request: any) => (
//                                     <motion.li
//                                         key={request._id}
//                                         className="flex items-center justify-between p-4 hover:bg-primary transition-colors rounded-lg shadow"
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         onClick={() => handleUserClick(request._id)}
//                                     >
//                                         <span className="font-semibold">
//                                             {request.from}
//                                         </span>
//                                         <div className="space-x-2">
//                                             <Button
//                                                 onClick={() =>
//                                                     handleRespondToRequest(
//                                                         request._id,
//                                                         "accept"
//                                                     )
//                                                 }
//                                                 variant="default"
//                                             >
//                                                 Accept
//                                             </Button>
//                                             <Button
//                                                 onClick={() =>
//                                                     handleRespondToRequest(
//                                                         request._id,
//                                                         "reject"
//                                                     )
//                                                 }
//                                                 variant="outline"
//                                             >
//                                                 Reject
//                                             </Button>
//                                         </div>
//                                     </motion.li>
//                                 ))}
//                             </ul>
//                         )}
//                     </motion.div>
//                 )}

// {activeTab === "add" && (
//                 <motion.div
//                     key="add-friend"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.2 }}
//                     className="text-white"
//                 >
//                     <h2 className="text-2xl font-bold mb-4">Add Friend</h2>
//                     <div className="flex space-x-2 mb-4">
//                         <Input
//                             type="text"
//                             placeholder="Search users..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="text-white"
//                         />
//                         <Button onClick={handleSearch}>Search</Button>
//                     </div>
//                     {isLoadingSearch ? (
//                         <p>Searching...</p>
//                     ) : (
//                         <ul className="space-y-4">
//                             {searchResults?.map((user: any) => (
//                                 <motion.li
//                                     key={user.uid}
//                                     className="flex items-center justify-between p-4 hover:bg-primary transition-colors rounded-lg shadow cursor-pointer"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     onClick={() => handleUserClick(user.userName)}
//                                 >
//                                     <div className="flex items-center">
//                                         <Avatar>
//                                             <AvatarImage
//                                                 src={`/api/avatar/${user.userName}`}
//                                                 alt={user.userName}
//                                             />
//                                             <AvatarFallback>
//                                                 {user.userName
//                                                     .substring(0, 2)
//                                                     .toUpperCase()}
//                                             </AvatarFallback>
//                                         </Avatar>
//                                         <span className="ml-4 font-semibold">
//                                             {user.userName}
//                                         </span>
//                                     </div>
//                                     <Button
//                                         onClick={(e) => {
//                                             e.stopPropagation()
//                                             handleSendRequest(user.userName)
//                                         }}
//                                     >
//                                         Send Request
//                                     </Button>
//                                 </motion.li>
//                             ))}
//                         </ul>
//                     )}
//                 </motion.div>
//             )}
//             </AnimatePresence>
//         </div>
//     )
// }

// export default FriendsSearch

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
import { MessageCircle, MoreVertical, Users } from "lucide-react"

const searchSchema = z
    .string()
    .min(3, "Search term must be at least 3 characters long")

const FriendsSearch: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "add">("all")
    const [searchTerm, setSearchTerm] = useState("")
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

    const handleSendRequest = (friendUserName: string) => {
        sendFriendRequestMutation.mutate(friendUserName, {
            onSuccess: () => {
                toast.success("Friend request sent successfully.")
            },
            onError: (error) => {
                // toast.error("Failed to send friend request. Please try again.")

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

    const handleRemoveFriend = (friendUserName: string) => {
        removeFriendMutation.mutate(friendUserName, {
            onSuccess: () => {
                toast.success("Friend removed successfully.")
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

    // ... (keep all the handler functions as they were)

    return (
        <div className="min-h-screen  text-gray-100 p-4 w-full">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
                {/* <div className="mb-6">
                    <Input
                        className="w-full bg-gray-800 border-gray-700 focus:border-gray-600"
                        placeholder="Search"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div> */}
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
                                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() =>
                                                handleUserClick(friend)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
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
                                                    variant="ghost"
                                                >
                                                    <MessageCircle className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleRemoveFriend(
                                                            friend
                                                        )
                                                    }
                                                >
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}

                    {activeTab === "pending" && (
                        <motion.section
                            key="pending-requests"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-lg font-semibold mb-4">
                                PENDING REQUESTS —{" "}
                                {pendingRequests?.length || 0}
                            </h2>
                            {isLoadingRequests ? (
                                <p>Loading requests...</p>
                            ) : (
                                <ul className="space-y-4">
                                    {pendingRequests.map((request: any) => (
                                        <motion.li
                                            key={request._id}
                                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() =>
                                                handleUserClick(request.from)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={`/api/avatar/${request.from}`}
                                                        alt={request.from}
                                                    />
                                                    <AvatarFallback>
                                                        {request.from
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {request.from}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        Incoming Request
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-x-2">
                                                <Button
                                                    onClick={() =>
                                                        handleRespondToRequest(
                                                            request._id,
                                                            "accept"
                                                        )
                                                    }
                                                    variant="default"
                                                    size="sm"
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
                                                    size="sm"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}

                    {activeTab === "add" && (
                        <motion.section
                            key="add-friend"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-lg font-semibold mb-4">
                                ADD FRIEND
                            </h2>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="bg-gray-800 border-gray-700 focus:border-gray-600"
                                />
                                <Button onClick={handleSearch}>Search</Button>
                            </div>
                            {isLoadingSearch ? (
                                <p>Searching...</p>
                            ) : (
                                <ul className="space-y-4">
                                    {searchResults?.map((user: any) => (
                                        <motion.li
                                            key={user.uid}
                                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() =>
                                                handleUserClick(user.userName)
                                            }
                                        >
                                            <div className="flex items-center gap-3"
                                             onClick={() => handleUserClick(user.userName)}
                                            >
                                                <Avatar>
                                                    <AvatarImage
                                                        src={`/api/avatar/${user.userName}`}
                                                        alt={user.userName}
                                                    />
                                                    <AvatarFallback>
                                                        {user.userName
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {user.userName}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        User
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleSendRequest(
                                                        user.userName
                                                    )
                                                }
                                                size="sm"
                                            >
                                                Send Request
                                            </Button>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default FriendsSearch
