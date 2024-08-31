import React, { useState } from "react"
import { useSearchUsers } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import { RxCrossCircled } from "react-icons/rx"
import { FaSearch } from "react-icons/fa" // Import search icon
import "../../index.css"

interface User {
    _id: string
    userName: string
    profile_image: string | null
}

// Mock user data
const usersData: any = []

const FriendSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedFriends, setSelectedFriends] = useState<User[]>([])
    const { user } = useAuth()
    const { data: users, isLoading } = useSearchUsers(searchTerm, user?.uid)

    const handleAddFriend = (user: User) => {
        const isDuplicate = selectedFriends.some(
            (friend) => friend._id === user._id
        )
        if (isDuplicate) {
            toast.warn("This user is already in your friends list.")
        } else {
            setSelectedFriends([...selectedFriends, user])
            toast.success("Friend added to your list!")
            setSearchTerm("")
        }
    }

    const handleRemoveFriend = (userId: string) => {
        setSelectedFriends(
            selectedFriends.filter((friend) => friend._id !== userId)
        )
        toast.info("Friend removed from your list.")
    }

    return (
        <div className="min-h-screen w-full p-4 bg-main text-white flex flex-col items-center justify-start">
            <div className="w-full max-w-3xl rounded-2xl p-4 hover:border-t-2 hover:border-bg-gray-500 bg-main text-white shadow-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center font-Montserrat">
                    Stay Connected, Anytime, Anywhere.
                </h1>
                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-10 py-2 rounded-2xl focus:outline-none focus:ring bg-white bg-opacity-10 text-white"
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isLoading && searchTerm.length > 3 && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
                {isLoading && searchTerm.length > 3 ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <ul className="max-h-[300px] overflow-y-auto bg-white bg-opacity-10 rounded-lg shadow-lg mb-6">
                        {searchTerm.length > 3 &&
                            users?.slice(0, 10).map((user: User) => (
                                <li
                                    key={user._id}
                                    className="flex justify-between items-center p-3 hover:bg-white hover:bg-opacity-20 cursor-pointer border-b border-white border-opacity-20"
                                >
                                    <div className="flex items-center space-x-4">
                                        {user.profile_image && (
                                            <img
                                                src={user.profile_image}
                                                alt={user.userName}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        )}
                                        <span>{user.userName}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleAddFriend(user)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                    </ul>
                )}
                {selectedFriends.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">
                            Your Friends:
                        </h3>
                        <ul className="space-y-4 max-h-[300px] overflow-y-auto">
                            {selectedFriends.map((friend) => (
                                <li
                                    key={friend._id}
                                    className="flex items-center space-x-4 bg-white bg-opacity-10 p-3 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-colors"
                                >
                                    {friend.profile_image && (
                                        <img
                                            src={friend.profile_image}
                                            alt={friend.userName}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    )}
                                    <span className="flex-grow">
                                        {friend.userName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFriend(friend._id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <RxCrossCircled size="24px" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FriendSearch
