import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { SimpleMovie } from "@/Types/Movie"
import {
    IconUser,
    IconList,
    IconChartBar,
    IconMovie,
} from "@tabler/icons-react"
import { Users, Award } from "lucide-react"
import { BarChart1 } from "@/components/charts/BarChart"
import { useFriends } from "@/services/friendsService"
import { fetchMoviesByIds } from "@/services/movieService"
import DynamicBarChart from "@/components/charts/DynamicChart"
import { useJournal } from "@/services/journalService"
import { calculateStats, MovieStats } from "@/lib/stats"

interface MovieInList {
    movie_id: string
    id: string
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

const UserDescriptivePage: React.FC = () => {
    const { userName } = useParams<{ userName: string }>()
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [movieData, setMovieData] = useState<SimpleMovie[]>([])
    const navigate = useNavigate()
    const { useGetFriendData } = useFriends()
    const {
        data: userData,
        isLoading,
        error,
    } = useGetFriendData(userName || "")
    const { useGetFriendJournalEntries } = useJournal()
    const {
        data: journalEntries,
        isLoading: isJournalLoading,
        error: Journalerror,
    } = useGetFriendJournalEntries(userName!)
    const [stats, setStats] = useState<MovieStats | null>(null)

    useEffect(() => {
        const fetchMovies = async () => {
            if (userData?.lists[activeIndex]?.movies) {
                const movieIds = userData.lists[activeIndex].movies.map(
                    (m: any) => m.movie_id
                )
                try {
                    const movies = await fetchMoviesByIds(movieIds)
                    setMovieData(movies)
                } catch (error) {
                    console.error("Error fetching movie data:", error)
                }
            }
        }
        if (journalEntries) {
            const movieStats = calculateStats(journalEntries)
            setStats(movieStats)
        }

        fetchMovies()
    }, [userData, activeIndex, journalEntries])
    if (isJournalLoading) {
        ;<div>Loading...</div>
    }
    if (error || !stats) {
        return <div>Error loading stats. Please try again later.</div>
    }
    const monthlyWatchedData = stats.monthlyWatched.map((item) => ({
        month: item.month,
        desktop: item.count,
    }))
    const currentMonth = stats.monthlyWatched[stats.monthlyWatched.length - 1]
    const lastMonth = stats.monthlyWatched[stats.monthlyWatched.length - 2]
    const moviesDiff = currentMonth
        ? currentMonth.count - (lastMonth ? lastMonth.count : 0)
        : 0

    const handleSelectList = (listId: string) => {
        navigate(`/list/${listId}`)
    }

    const MoviePreview = ({ movie }: { movie: SimpleMovie }) => (
        <div className="flex items-center space-x-2">
            <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded"
                onClick={() => navigate(`/movie/${movie.id}`)}
            />
            <span className="text-sm font-medium">{movie.title}</span>
        </div>
    )

    const BentoGridItem: React.FC<{
        title: string
        description: string
        icon: React.ReactNode
        children: React.ReactNode
        className?: string
    }> = ({ title, description, icon, children, className }) => (
        <div
            className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 flex flex-col ${className}`}
        >
            <div className="flex items-center space-x-2 mb-4">
                {icon}
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="flex-grow">{children}</div>
        </div>
    )

    const ProfileInfo = () => (
        <div className="flex flex-row items-center justify-center gap-3 space-y-2">
            <img
                src={userData?.profile_image}
                alt={userData?.userName}
                className="w-24 h-24 rounded-full"
            />
            <div className="text-center flex flex-col">
                <h2 className="text-3xl font-bold">{userData?.userName}</h2>
                <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center justify-center ">
                        <Users className="w-4 mr-2 text-blue-400  font-bold" />
                        <p className="">{userData?.friends.length}</p>
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <Award className="w-4 h-4 mr-2 text-yellow-400" />
                        <p className="">{userData?.badges.length}</p>
                    </div>
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
    }

    if (error) {
        return <div>Error loading user data</div>
    }

    if (!userData) {
        return <div>User not found</div>
    }

    return (
        <div className="max-h-screen overflow-auto scrollbar-hide px-12 lg:mt-0 lg:pt-2 pt-10 pb-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full scrollbar-hide mx-auto">
                <BentoGridItem
                    title="Profile Info"
                    description="User profile details and stats"
                    icon={<IconUser className="h-6 w-6 text-blue-400" />}
                >
                    <ProfileInfo />
                </BentoGridItem>
                <BentoGridItem
                    title="User's Lists"
                    description="View and explore user's movie lists"
                    icon={<IconList className="h-6 w-6 text-green-400" />}
                >
                    <div className="space-y-2 h-12 overflow-auto ">
                        {userData.lists.map((item: any, index: number) => (
                            <button
                                key={index}
                                className={`p-2 w-full rounded-md text-left transition-all duration-300 ${
                                    activeIndex === index
                                        ? "bg-gradient-to-tr from-gray-900 to-gray-800"
                                        : "bg-gray-700 hover:bg-gray-600"
                                }`}
                                onClick={() => setActiveIndex(index)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    title="User Stats"
                    description="View user's movie watching statistics"
                    icon={<IconChartBar className="h-6 w-6 text-yellow-400" />}
                    className="md:row-span-2"
                >
                    <h2
                        className="hover:cursor-pointer hover:text-gray-300"
                        onClick={() => navigate(`/stats/${userData.userName}`)}
                    >
                        view user stats
                    </h2>
                    <DynamicBarChart data={monthlyWatchedData} />
                </BentoGridItem>
                <BentoGridItem
                    title={`${userData?.lists[activeIndex]?.name || "Selected List"} Preview`}
                    description={`Movies in ${userData.lists[activeIndex]?.name || "selected list"}`}
                    icon={<IconMovie className="h-6 w-6 text-purple-400" />}
                    className="md:col-span-2"
                >
                    <AnimatePresence>
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="space-y-3 max-h-40 overflow-auto scrollbar-hide">
                                {movieData.map((movie) => (
                                    <MoviePreview
                                        key={movie.id}
                                        movie={movie}
                                    />
                                ))}
                            </div>
                            {/* <button
                                onClick={() =>
                                    handleSelectList(
                                        userData.lists[activeIndex].list_id
                                    )
                                }
                                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                View Full List
                            </button> */}
                        </motion.div>
                    </AnimatePresence>
                </BentoGridItem>
            </div>
        </div>
    )
}

export default UserDescriptivePage
