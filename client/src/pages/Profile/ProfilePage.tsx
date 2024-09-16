import React, { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
import { getUserData } from "../../services/userService"
import "./profile.css"
import { fetchMoviesByIds } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"
import { useNavigate } from "react-router-dom";
// import Drawer from "@/components/custom/Drawer/Drawer"
import { Drawer } from "@/components/ui/drawer"
import CreateList from "../CreateList/CreateList"
import { Button } from "@/components/ui/button"


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

const ITEMS_PER_PAGE = 20

const Profile: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [direction, setDirection] = useState<number>(0)
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserData | null>(null)

    const [movieData, setMovieData] = useState<SimpleMovie[]>([])
    const navigate = useNavigate();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCreateList = () => {
        setIsDrawerOpen(true);
      };
    
      const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
      };
    

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

    useEffect(() => {
        const fetchMovies = async () => {
            if (userData?.lists[activeIndex]?.movies) {
                const movieIds = userData.lists[activeIndex].movies.map(
                    (m) => m.movie_id
                )
                try {
                    const movies = await fetchMoviesByIds(movieIds)
                    setMovieData(movies)
                } catch (error) {
                    console.error("Error fetching movie data:", error)
                }
            }
        }

        fetchMovies()
    }, [userData, activeIndex])

    const handleSelectList = (listId: string) => {
        console.log("Selected list:", listId)
        navigate(`/list/${listId}`);
    };

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

    const MovieCard: React.FC<{ movie: SimpleMovie; isLast: boolean }> = ({
        movie,
        isLast,
    }) => (
        <div className="relative w-full pb-[150%] overflow-hidden rounded-lg">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute  bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-sm font-semibold text-white truncate">
                    {movie.title}
                </h3>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col rounded-md items-center justify-center w-full h-full  from-primary to-secondary text-white">
            <div className="flex flex-col md:flex-col sm:flex-row w-[90%] h-[90%] gap-4">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
                    {/* Profile Card */}
                    <motion.div className="flex items-center justify-center w-full md:w-1/2 h-full  from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ease-in border-r-2 border-b-2 hover:border-r-8 hover:border-b-8 ease-out transition duration-1000">
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
                    <div className="flex items-center justify-center w-full md:w-1/2 h-full  from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ease-in ease-out border-r-2 border-b-2 hover:border-r-8 hover:border-b-8 transition duration-300">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                            Bento Stats
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
                    {/* Map List Card */}
                    <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ease-in ease-out border-r-2 border-b-2 hover:border-r-8 hover:border-b-8 transition duration-300">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
                            Your List
                        </h2>
                        <div className="flex flex-col space-y-2 w-[70%] max-h-[calc(100%-10rem)] overflow-y-auto pr-2">
                {userData?.lists.map((item, index) => (
                    <button
                        key={index}
                        className={`p-2 w-full min-w-[12rem] rounded-2xl text-center transition-all duration-700 ease-in-out ${
                            activeIndex === index
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => handleSelectList(item.list_id)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
                        <button
                            className="mt-4 p-2 w-full max-w-xs rounded-2xl text-center bg-green-500 hover:bg-green-600 transition-all duration-300 ease-in-out"
                            onClick={handleCreateList}
                        >
                            Create List +
                        </button>
                    </div>

                    {/* Movie Grid */}
                    <div className="flex items-center justify-center w-full md:w-1/2 h-full  from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg relative hover:ease-in ease-out border-r-2 border-b-2 hover:border-r-8 hover:border-b-8 transition duration-300 overflow-hidden">
                        <AnimatePresence>
                            <motion.div
                                key={activeIndex}
                                className="w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 text-center">
                                    {userData?.lists[activeIndex]?.name ||
                                        "Loading..."}
                                </h3>
                                <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100%-6rem)]">
                                    {movieData.map((movie, index) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            isLast={
                                                index === movieData.length - 1
                                            }
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <CreateList onClose={handleCloseDrawer} />
      </Drawer>
        </div>
    )
}

export default Profile
