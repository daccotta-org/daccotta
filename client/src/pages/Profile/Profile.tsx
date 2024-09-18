import React, { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { getUserData } from "../../services/userService"
import { fetchMoviesByIds } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"
import { useNavigate } from "react-router-dom"
import { Drawer } from "@/components/ui/drawer"
import CreateList from "../CreateList/CreateList"
import {
    IconUser,
    IconList,
    IconChartBar,
    IconMovie,
} from "@tabler/icons-react"
import {
    UserCircle,
    ListTodo,
    BarChart3,
    Clapperboard,
    Users,
    Award,
    Film,
} from "lucide-react"
import { BarChart1 } from "@/components/charts/BarChart"

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

interface MovieInList {
    movie_id: string
    id: string
}

const Profile: React.FC = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [movieData, setMovieData] = useState<SimpleMovie[]>([])
    const navigate = useNavigate()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const data = await getUserData(user.uid)
                    setUserData(data)
                    if (data.lists[0]?.movies) {
                        const movieIds = data.lists[0].movies
                            .slice(0, 5)
                            .map((m: SimpleMovie) => m.movie_id)
                        const movies = await fetchMoviesByIds(movieIds)
                        setMovieData(movies)
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }

        fetchUserData()
    }, [user])

    const handleCreateList = () => {
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
    }

    const ProfileInfo = () => (
        <div className="flex flex-row items-center justify-center gap-3 space-y-2">
            <img
                src={userData?.profile_image}
                alt={userData?.userName}
                className="w-24 h-24 rounded-full"
            />
            <div className="text-center flex flex-col">
                <h2 className="text-3xl font-bold">{userData?.userName}</h2>
                <div className="flex flex-col items-center ">
                    <div className="flex gap-1 items-center justify-center">
                        <Users className="w-4 mr-2 text-blue-400" />
                        <p className=""> {userData?.friends.length}</p>
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <Award className="w-4 h-4 mr-2 text-yellow-400" />
                        <p className="">{userData?.badges.length} </p>
                    </div>
                </div>
            </div>
        </div>
    )

    const MoviePreview = ({ movie }: { movie: SimpleMovie }) => (
        <div className="flex items-center space-x-2 ">
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

    return (
        <div className="max-h-screen overflow-auto scrollbar-hide  px-12 lg:mt-0 lg:pt-2 pt-10 pb-6  text-white">
            {/* <h1 className="text-4xl font-bold mb-8 text-center">
                Your Profile
            </h1> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full  scrollbar-hide mx-auto">
                <BentoGridItem
                    title="Profile Info"
                    description="Your profile details and stats"
                    icon={<IconUser className="h-6 w-6 text-blue-400" />}
                >
                    <ProfileInfo />
                </BentoGridItem>
                <BentoGridItem
                    title="Your Lists"
                    description="View and manage your movie lists"
                    icon={<IconList className="h-6 w-6 text-green-400" />}
                >
                    <button
                        onClick={() => navigate("/lists")}
                        className="mb-4 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        View All Lists
                    </button>
                    <div className="space-y-3 max-h-20 overflow-auto scrollbar-hide">
                        {movieData.slice(0, 5).map((movie) => (
                            <MoviePreview key={movie.id} movie={movie} />
                        ))}
                    </div>
                </BentoGridItem>
                <BentoGridItem
                    title="Your Stats"
                    description="View your movie watching statistics"
                    icon={<IconChartBar className="h-6 w-6 text-yellow-400" />}
                    className="md:row-span-2"
                >
                    <button
                        onClick={() => navigate("/stats")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                        View Stats
                    </button>
                    <BarChart1 />
                </BentoGridItem>
                <BentoGridItem
                    title="AI Recommendations"
                    description="Personalized movie recommendations"
                    icon={<IconMovie className="h-6 w-6 text-purple-400" />}
                    className="md:col-span-2"
                >
                    <button
                        onClick={() => navigate("/recommendations")}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        View Recommendations
                    </button>
                </BentoGridItem>
            </div>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <CreateList onClose={handleCloseDrawer} />
            </Drawer>
        </div>
    )
}

export default Profile
