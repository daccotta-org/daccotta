import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { useSearchUsers } from "../../../services/userService"
import { toast } from "react-toastify"
import { RxCrossCircled } from "react-icons/rx"
import { useAuth } from "../../../hooks/useAuth"
import "../../../index.css"
import CircularIndeterminate from "@/components/ui/loading"

// Define the Friends schema
export const friendsSchema = z.object({
    friends: z.array(z.string()).optional(), // Array of user IDs
})

type FriendsData = z.infer<typeof friendsSchema>
type User = { _id: string; userName: string; profile_image: string | null }

interface Props {
    onPrevious: () => void
    onSubmit: () => void
    isSubmitting: boolean
}

const AddFriends: React.FC<Props> = ({
    onPrevious,
    onSubmit,
    isSubmitting,
}) => {
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<FriendsData>()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFriends, setSelectedFriends] = useState<User[]>([])
    const { user } = useAuth()
    const { data: users, isLoading } = useSearchUsers(searchTerm, user?.uid)

    const friends = watch("friends") || [""]

    const handleAddFriend = (user: User) => {
        const isDuplicate = selectedFriends.some(
            (friend) => friend._id === user._id
        )
        if (isDuplicate) {
            toast.warn("This user is already in your friends list.")
        } else {
            console.log("id : ", user._id)
            friends.push(user._id)
            setValue("friends", friends)
            console.log(friends)

            setSelectedFriends([...selectedFriends, user]) // Store full user object for UI display
            toast.success("Friend added to your list!")
            setSearchTerm("")
        }
    }

    const handleRemoveFriend = (userId: string) => {
        setValue(
            "friends",
            friends.filter((id) => id !== userId)
        )
        setSelectedFriends(
            selectedFriends.filter((friend) => friend._id !== userId)
        )
        toast.info("Friend removed from your list.")
    }

    return (
        <div className="w-full h-full lg:grid lg:grid-cols-5 lg:min-h-screen ">
            <div className="w-full h-full flex flex-col items-center py-24 col-span-2 justify-start lg:justify-center bg-main">
                <h2 className="text-3xl font-bold mb-12 px-4 text-center">
                    Add Friends
                </h2>
                <div className="relative mb-6">
                    <input
                        type="text"
                        className="input input-bordered w-[320px] sm:w-[400px] bg-transparent text-white justify-center flex"
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        <ul className="z-10 overflow-y-auto scrollbar-hide max-h-[300px] bg-white text-gray-800 rounded-lg shadow-lg">
                            {searchTerm.length > 3 &&
                                users?.slice(0, 10).map((user: User) => (
                                    <li
                                        key={user._id}
                                        className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer border-b-2"
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
                                            onClick={() =>
                                                handleAddFriend(user)
                                            }
                                        >
                                            Add
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
                {selectedFriends.length > 0 && (
                    <div className="mb-4 w-[320px] sm:w-[400px]">
                        <h3 className="text-xl font-semibold mb-2">
                            Your Friends:
                        </h3>
                        <ul className="space-y-4 h-[180px] overflow-y-auto scrollbar-hide">
                            {selectedFriends.map((friend) => (
                                <li
                                    key={friend._id}
                                    className="flex items-center space-x-4 bg-white bg-opacity-10 p-1 w-[320px] sm:w-[400px] border border-primary border-1 rounded-lg hover:bg-primary hover:text-white transition-colors"
                                >
                                    {friend.profile_image && (
                                        <img
                                            src={friend.profile_image}
                                            alt={friend.userName}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    )}
                                    <span className="flex-grow text-sm">
                                        {friend.userName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFriend(friend._id)
                                        }
                                    >
                                        <RxCrossCircled size="24px" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {errors.friends && (
                    <span className="text-red-500">
                        {errors.friends.message}
                    </span>
                )}
                <div className="mt-10 self-end lg:self-auto flex w-full justify-evenly">
                    <button
                        type="button"
                        className="btn btn-secondary text-white"
                        onClick={onPrevious}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline hover:bg-primary hover:text-white"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Final Submit"}
                    </button>
                </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:col-span-3 bg-[#FFEBCD]">
                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src="/profile_page.svg"
                        alt="Sign Up Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddFriends
