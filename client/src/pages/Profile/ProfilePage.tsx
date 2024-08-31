import React, { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import { getUserData } from "../../services/userService"
import "./profile.css"

// Define the type for each carousel item
interface MovieInList {
    movie_id: string
}
interface List {
    list_id: string
    name: string
    list_type: "user" | "group"
    movies: MovieInList[]
    members: {
        user_id: string
        is_author: boolean
    }[]
    description: string
    date_created: Date
}
interface UserData {
    userName: string
    email: string
    age: number
    badges: string[]
    groups: string[]
    lists: List[]
    directors: string[]
    actors: string[]
    profile_image: string
    friends: string[]
}

const Profile: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [direction, setDirection] = useState<number>(0)
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const data = await getUserData(user.uid)
                    setUserData(data)
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }

        fetchUserData()
    }, [user])

    const handlePrev = () => {
        setDirection(-1)
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? (userData?.lists.length || 1) - 1 : prevIndex - 1
        )
    }

    const handleNext = () => {
        setDirection(1)
        setActiveIndex((prevIndex) =>
            prevIndex === (userData?.lists.length || 1) - 1 ? 0 : prevIndex + 1
        )
    }

    const handleSelect = (index: number) => {
        setDirection(index > activeIndex ? 1 : -1)
        setActiveIndex(index)
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            position: "absolute" as const,
            top: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            position: "relative" as const,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            position: "absolute" as const,
            top: 0,
        }),
    }

    return (
        <div className="flex flex-col rounded-md items-center justify-center w-full h-full bg-gradient-to-tr from-primary to-secondary text-white">
            <div className="flex flex-col md:flex-col sm:flex-row w-[90%] h-[90%] gap-4">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
                    {/* Profile Card */}
                    <motion.div className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 w-32 h-32">
                                <img
                                    src={userData?.profile_image}
                                    className="rounded-full"
                                    alt=""
                                />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold">
                                    {userData?.userName || "Loading..."}
                                </h2>
                                <p className="text-gray-300 text-sm">
                                    {userData?.email || "Loading..."}
                                </p>
                                <div className="flex mt-2">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-yellow-400">★</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Card */}
                    <div className="flex items-center justify-center w-full md:w-1/2 h-full  bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                            Bento Stats
                        </h2>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
                    {/* Map List Card */}
                    <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full  bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
                            Map &lt;List&gt;
                        </h2>
                        <div className="flex flex-col space-y-2">
                            {userData?.lists.map((item, index) => (
                                <button
                                    key={index}
                                    className={`p-2 w-72 rounded-lg text-center transition-all duration-700 ease-in-out ${
                                        activeIndex === index
                                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                            : "bg-gray-700 hover:bg-gray-600"
                                    }`}
                                    onClick={() => handleSelect(index)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg relative hover:ring-2 hover:ease-in ease-out transition duration-300 overflow-hidden">
                        <button
                            className="text-white hover:text-yellow-400 absolute left-2"
                            onClick={handlePrev}
                        >
                            &lt;
                        </button>
                        <AnimatePresence custom={direction}>
                            <motion.div
                                key={activeIndex}
                                className="w-full h-full flex items-center justify-center"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    },
                                    opacity: { duration: 0.2 },
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(_, { offset, velocity }) => {
                                    const swipe =
                                        Math.abs(offset.x) * velocity.x
                                    if (swipe < -1000) {
                                        handleNext()
                                    } else if (swipe > 1000) {
                                        handlePrev()
                                    }
                                }}
                            >
                                <div className="text-center">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold transition mb-4">
                                        {userData?.lists[activeIndex]?.name ||
                                            "Loading..."}
                                    </h3>
                                    <div className="overflow-y-auto max-h-[200px]">
                                        {userData?.lists[
                                            activeIndex
                                        ]?.movies.map((movie, index) => (
                                            <p
                                                key={index}
                                                className="mt-2 transition"
                                            >
                                                Movie ID: {movie.movie_id}
                                            </p>
                                        )) || "No movies in this list"}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <button
                            className="text-white hover:text-yellow-400 absolute right-2"
                            onClick={handleNext}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
